import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { PerformanceMonitor } from "@react-three/drei";
import * as THREE from "three";
import { useMission } from "../store";
import { skills } from "../data/content";
import { flight } from "./Flight";
class Boundary extends Component<
  { children: ReactNode; onFailure: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onFailure();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}
const route = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0, 0, 10),
  new THREE.Vector3(0.6, 0.5, 8.6),
  new THREE.Vector3(-2, 1, 9),
  new THREE.Vector3(1, -0.7, 9.5),
  new THREE.Vector3(-1, 0, 8),
  new THREE.Vector3(0.7, 0.5, 10),
  new THREE.Vector3(-1, 0, 9),
  new THREE.Vector3(0, 1, 10),
  new THREE.Vector3(0, 0, 10),
]);
function World({
  low,
  mobile,
  onReady,
}: {
  low: boolean;
  mobile: boolean;
  onReady: () => void;
}) {
  const group = useRef<THREE.Group>(null);
  const ship = useRef<THREE.Group>(null);
  const graph = useRef<THREE.Group>(null);
  const instances = useRef<THREE.InstancedMesh>(null);
  const { camera, gl } = useThree();
  const theme = useMission((s) => s.theme);
  const color = theme === "race" ? "#ffba71" : "#83f5e7";
  const [selected, setSelected] = useState("React / Vite");
  const allSkills = useMemo(() => Object.values(skills).flat(), []);
  const nodes = useMemo(
    () =>
      allSkills.map(
        (_, i) =>
          new THREE.Vector3(
            Math.cos(i * 2.399) * 1.7,
            Math.sin(i * 2.399) * 1.2,
            ((i % 3) - 0.8) * 0.5,
          ),
      ),
    [allSkills],
  );
  const connections = useMemo(() => {
    const a: number[] = [];
    allSkills.forEach((s, i) =>
      allSkills.forEach((t, j) => {
        if (j > i && s.evidence.some((p) => t.evidence.includes(p)))
          a.push(...nodes[i].toArray(), ...nodes[j].toArray());
      }),
    );
    return new Float32Array(a);
  }, [allSkills, nodes]);
  const stars = useMemo(() => {
    const a = new Float32Array((low ? 350 : 1100) * 3),
      r = rng(31);
    for (let i = 0; i < a.length; i++) a[i] = (r() - 0.5) * 50;
    return a;
  }, [low]);
  const starUniforms = useMemo(
    () => ({ time: { value: 0 }, tint: { value: new THREE.Color("#9fb8c9") } }),
    [],
  );
  const globe = useMemo(() => {
    const a: THREE.Vector3[] = [];
    const n = low ? 90 : 150;
    for (let i = 0; i < n; i++) {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n),
        theta = i * 2.399963;
      a.push(
        new THREE.Vector3(
          1.75 * Math.sin(phi) * Math.cos(theta),
          1.75 * Math.cos(phi),
          1.75 * Math.sin(phi) * Math.sin(theta),
        ),
      );
    }
    return a;
  }, [low]);
  const network = useMemo(() => {
    const a: number[] = [];
    for (let i = 0; i < globe.length; i++)
      for (let j = i + 1; j < globe.length; j++)
        if (globe[i].distanceTo(globe[j]) < 0.59)
          a.push(...globe[i].toArray(), ...globe[j].toArray());
    return new Float32Array(a);
  }, [globe]);
  const positions = useMemo(
    () => new Float32Array(globe.flatMap((n) => n.toArray())),
    [globe],
  );
  useEffect(() => {
    onReady();
    const handler = (e: Event) => setSelected((e as CustomEvent).detail.name);
    window.addEventListener("skill-selection", handler);
    const canvas = gl.domElement;
    const fail = (e: Event) => {
      e.preventDefault();
      useMission.getState().set({ recruiter: true });
    };
    canvas.addEventListener("webglcontextlost", fail);
    return () => {
      window.removeEventListener("skill-selection", handler);
      canvas.removeEventListener("webglcontextlost", fail);
    };
  }, []);
  useEffect(() => {
    const mesh = instances.current;
    if (!mesh) return;
    const matrix = new THREE.Matrix4();
    allSkills.forEach((s, i) => {
      matrix.makeTranslation(...nodes[i].toArray());
      mesh.setMatrixAt(i, matrix);
      mesh.setColorAt(
        i,
        new THREE.Color(s.name === selected ? "#ffb071" : color),
      );
    });
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [selected, color, nodes, allSkills]);
  useFrame((state, delta) => {
    const p = THREE.MathUtils.clamp(flight.progress, 0, 0.999);
    camera.position.lerp(route.getPoint(p), Math.min(1, delta * 3));
    camera.lookAt(0, 0, 0);
    starUniforms.time.value = state.clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y += delta * 0.035;
      group.current.rotation.z =
        Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
      const box = document.getElementById("home")?.getBoundingClientRect();
      group.current.visible = Boolean(box && box.bottom > 0);
      group.current.position.set(mobile ? 0 : 2.65, mobile ? -4.2 : 0.25, 0);
      group.current.scale.setScalar(mobile ? 0.85 : 1);
    }
    if (ship.current) {
      const a = state.clock.elapsedTime * 0.13 + p * 8;
      ship.current.position.set(
        (mobile ? 0 : 2.65) + Math.cos(a) * 2.6,
        (mobile ? -4.2 : 0.25) + Math.sin(a) * 0.9,
        Math.sin(a) * 1.4,
      );
      ship.current.rotation.z = a - Math.PI / 2;
      ship.current.visible = true;
      if (p >= 0.18)
        ship.current.position.set(
          camera.position.x + (mobile ? 1 : 2.4),
          camera.position.y - 1.6,
          camera.position.z - 5,
        );
    }
    if (graph.current) {
      const r = document.getElementById("skills")?.getBoundingClientRect();
      graph.current.visible = Boolean(r && r.top < innerHeight && r.bottom > 0);
      if (r)
        graph.current.position.set(
          mobile ? 0 : 2.4,
          (0.5 - (r.top + r.height * 0.55) / innerHeight) * 10,
          -1,
        );
      graph.current.rotation.y = state.clock.elapsedTime * 0.04;
    }
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={2} />
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[stars, 3]} />
        </bufferGeometry>
        <shaderMaterial
          transparent
          depthWrite={false}
          uniforms={starUniforms}
          vertexShader={`uniform float time;varying float brightness;void main(){vec4 p=modelViewMatrix*vec4(position,1.0);gl_Position=projectionMatrix*p;gl_PointSize=clamp(20.0/-p.z,1.0,2.5);brightness=.35+.25*sin(time*.35+position.x*7.0);}`}
          fragmentShader={`uniform vec3 tint;varying float brightness;void main(){float d=length(gl_PointCoord-.5);gl_FragColor=vec4(tint,smoothstep(.5,.05,d)*brightness);}`}
        />
      </points>
      <group ref={group}>
        <mesh>
          <sphereGeometry args={[1.7, low ? 20 : 40, low ? 16 : 30]} />
          <meshStandardMaterial
            color="#071316"
            roughness={0.9}
            metalness={0.2}
          />
        </mesh>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[network, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={0.24} />
        </lineSegments>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[positions, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            color={color}
            size={0.026}
            transparent
            opacity={0.9}
          />
        </points>
        {[0, 1, 2].map((i) => (
          <mesh
            rotation={[1.25 + i * 0.28, 0.2 + i * 0.75, 0.3 + i * 0.5]}
            key={i}
          >
            <torusGeometry args={[2.2 + i * 0.14, 0.004, 4, low ? 80 : 140]} />
            <meshBasicMaterial
              color={i === 1 ? "#ffb071" : color}
              transparent
              opacity={i === 1 ? 0.6 : 0.28}
            />
          </mesh>
        ))}
      </group>
      <group ref={ship}>
        <mesh rotation={[0, 0, -Math.PI / 2]}>
          <coneGeometry args={[0.065, 0.2, 3]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <mesh position={[-0.13, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <coneGeometry args={[0.035, 0.12, 5]} />
          <meshBasicMaterial color="#ffb071" transparent opacity={0.6} />
        </mesh>
      </group>
      <group ref={graph}>
        <instancedMesh
          ref={instances}
          args={[undefined, undefined, allSkills.length]}
        >
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial />
        </instancedMesh>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[connections, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial color={color} transparent opacity={0.2} />
        </lineSegments>
      </group>
    </>
  );
}
export default function Scene({
  onReady,
  onFailure,
}: {
  onReady: () => void;
  onFailure: () => void;
}) {
  const [active, setActive] = useState(true);
  const [low, setLow] = useState(
    () =>
      navigator.hardwareConcurrency < 6 ||
      ((navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8) <
        4,
  );
  const mobile = innerWidth < 580;
  const wrapper = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () => setActive(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    const observer = new IntersectionObserver(([e]) =>
      setActive(e.isIntersecting && document.visibilityState === "visible"),
    );
    if (wrapper.current) observer.observe(wrapper.current);
    return () => {
      document.removeEventListener("visibilitychange", update);
      observer.disconnect();
    };
  }, []);
  return (
    <div className="scene-canvas" ref={wrapper} aria-hidden="true">
      <Boundary onFailure={onFailure}>
        <Canvas
          dpr={[1, mobile ? 1.25 : 1.5]}
          camera={{ position: [0, 0, 10], fov: 50 }}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          frameloop={active ? "always" : "demand"}
          onCreated={({ gl }) => gl.setClearColor("#05060a", 0)}
        >
          <PerformanceMonitor onDecline={() => setLow(true)} />
          <World low={low} mobile={mobile} onReady={onReady} />
          {!low && !mobile && (
            <EffectComposer multisampling={0}>
              <Bloom intensity={0.22} luminanceThreshold={0.8} mipmapBlur />
            </EffectComposer>
          )}
        </Canvas>
      </Boundary>
    </div>
  );
}

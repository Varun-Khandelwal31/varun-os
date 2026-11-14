import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { animate } from "animejs";
export const flight = { progress: 0 };
export default function Flight() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tween = gsap.to(flight, {
      progress: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.7,
      },
    });
    const lenis = new Lenis({
      duration: 0.85,
      smoothWheel: true,
      syncTouch: false,
      anchors: true,
    });
    let raf = 0;
    const frame = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    const win = document.querySelector(".win-art");
    let animation: ReturnType<typeof animate> | undefined;
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && win) {
          animation = animate(win, {
            opacity: [0, 1],
            scale: [0.8, 1],
            duration: 750,
            ease: "out(3)",
          });
          observer.disconnect();
        }
      },
      { threshold: 0.5 },
    );
    if (win) observer.observe(win);
    const cursor = document.createElement("div");
    cursor.className = "custom-cursor";
    document.body.append(cursor);
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      cursor.classList.add("active");
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
      cursor.classList.toggle(
        "hover",
        Boolean((e.target as HTMLElement).closest("a,button")),
      );
    };
    const leave = () => cursor.classList.remove("active");
    if (matchMedia("(pointer:fine)").matches)
      window.addEventListener("pointermove", move);
    document.addEventListener("pointerleave", leave);
    const handlers = [
      ...document.querySelectorAll<HTMLElement>(".magnetic"),
    ].map((b) => {
      const enter = (e: PointerEvent) => {
        if (e.pointerType !== "mouse") return;
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.08}px,${(e.clientY - r.top - r.height / 2) * 0.1}px)`;
      };
      const exit = () => {
        b.style.transform = "";
      };
      b.addEventListener("pointermove", enter);
      b.addEventListener("pointerleave", exit);
      return () => {
        b.removeEventListener("pointermove", enter);
        b.removeEventListener("pointerleave", exit);
        b.style.transform = "";
      };
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      lenis.destroy();
      cancelAnimationFrame(raf);
      observer.disconnect();
      animation?.revert();
      cursor.remove();
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", leave);
      handlers.forEach((h) => h());
    };
  }, []);
  return null;
}

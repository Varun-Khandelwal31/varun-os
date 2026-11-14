import { create } from "zustand";
type State = {
  recruiter: boolean;
  theme: "space" | "race";
  progress: number;
  maxProgress: number;
  level: number;
  bonus: number;
  visited: string[];
  toast: string;
  terminal: boolean;
  hydrated: boolean;
  set: (d: Partial<State>) => void;
  award: (key: string, text: string, points?: number) => void;
  hydrate: () => void;
};
export const useMission = create<State>((set, get) => ({
  recruiter: false,
  theme: "space",
  progress: 0,
  maxProgress: 0,
  level: 0,
  bonus: 0,
  visited: [],
  toast: "",
  terminal: false,
  hydrated: false,
  set: (d) => set(d),
  award: (key, text, points = 40) => {
    if (get().visited.includes(key)) return;
    set((s) => ({
      visited: [...s.visited, key],
      bonus: s.bonus + points,
      toast: text,
    }));
  },
  hydrate: () => {
    try {
      const d = JSON.parse(localStorage.getItem("varun-os-v1") || "{}");
      set({
        recruiter: d.recruiter === true,
        maxProgress:
          typeof d.maxProgress === "number"
            ? Math.min(1, Math.max(0, d.maxProgress))
            : 0,
        theme: d.theme === "race" ? "race" : "space",
        bonus: Number.isFinite(d.bonus)
          ? Math.max(0, Math.min(d.bonus, 10000))
          : 0,
        visited: Array.isArray(d.visited)
          ? d.visited.filter((x: unknown) => typeof x === "string")
          : [],
      });
    } catch {}
    set({ hydrated: true });
  },
}));
useMission.subscribe((s) => {
  if (!s.hydrated) return;
  try {
    localStorage.setItem(
      "varun-os-v1",
      JSON.stringify({
        recruiter: s.recruiter,
        theme: s.theme,
        bonus: s.bonus,
        maxProgress: s.maxProgress,
        visited: s.visited,
      }),
    );
  } catch {}
});

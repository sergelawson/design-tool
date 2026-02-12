import { create } from "zustand";

export type ScreenStatus = "loading" | "ready" | "error";

export interface Position {
  x: number;
  y: number;
}

export interface Screen {
  id: string;
  name: string;
  status: ScreenStatus;
  html: string;
  position: Position;
}

interface CanvasState {
  screens: Screen[];
  addScreen: (screen: Screen) => void;
  addScreens: (screens: Screen[]) => void;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  removeScreen: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
}

export const useCanvasStore = create<CanvasState>((set) => ({
  screens: [],
  addScreen: (screen) => set((state) => ({ screens: [...state.screens, screen] })),
  addScreens: (screens) => set((state) => ({ screens: [...state.screens, ...screens] })),
  updateScreen: (id, updates) =>
    set((state) => ({
      screens: state.screens.map((s) => (s.id === id ? { ...s, ...updates } : s)),
    })),
  removeScreen: (id) => set((state) => ({ screens: state.screens.filter((s) => s.id !== id) })),
  updatePosition: (id, position) =>
    set((state) => ({
      screens: state.screens.map((s) => (s.id === id ? { ...s, position } : s)),
    })),
}));

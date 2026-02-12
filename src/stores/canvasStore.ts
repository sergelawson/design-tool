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
  zoom: number;
  setZoom: (zoom: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  addScreen: (screen: Screen) => void;
  addScreens: (screens: Screen[]) => void;
  updateScreen: (id: string, updates: Partial<Screen>) => void;
  removeScreen: (id: string) => void;
  updatePosition: (id: string, position: Position) => void;
}

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5.0;
const ZOOM_STEP = 0.1;

export const useCanvasStore = create<CanvasState>((set) => ({
  screens: [],
  zoom: 1,
  setZoom: (zoom) => set({ zoom: Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM) }),
  zoomIn: () => set((state) => ({ zoom: Math.min(state.zoom + ZOOM_STEP, MAX_ZOOM) })),
  zoomOut: () => set((state) => ({ zoom: Math.max(state.zoom - ZOOM_STEP, MIN_ZOOM) })),
  resetZoom: () => set({ zoom: 1 }),
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

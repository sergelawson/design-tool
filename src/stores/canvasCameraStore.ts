import { create } from "zustand";

export type CameraState = {
  x: number;
  y: number;
  zoom: number;
};

type CanvasCameraStore = {
  camera: CameraState;
  setCamera: (camera: CameraState) => void;
  panBy: (dx: number, dy: number) => void;
  setZoom: (zoom: number) => void;
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

function clampZoom(zoom: number): number {
  return Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
}

export const useCanvasCameraStore = create<CanvasCameraStore>((set) => ({
  camera: { x: 0, y: 0, zoom: 1 },
  setCamera: (camera) =>
    set({
      camera: {
        ...camera,
        zoom: clampZoom(camera.zoom),
      },
    }),
  panBy: (dx, dy) =>
    set((state) => ({
      camera: {
        ...state.camera,
        x: state.camera.x + dx,
        y: state.camera.y + dy,
      },
    })),
  setZoom: (zoom) =>
    set((state) => ({
      camera: {
        ...state.camera,
        zoom: clampZoom(zoom),
      },
    })),
}));

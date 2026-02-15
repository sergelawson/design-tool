import type { CameraState } from "@/stores/canvasCameraStore";

export type Rect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

export type Size = {
  width: number;
  height: number;
};

const MIN_ZOOM = 0.1;
const MAX_ZOOM = 5;

export function clampZoom(zoom: number): number {
  return Math.min(Math.max(zoom, MIN_ZOOM), MAX_ZOOM);
}

export function getVisibleWorldRect(camera: CameraState, viewport: Size): Rect {
  const halfWidth = viewport.width / (2 * camera.zoom);
  const halfHeight = viewport.height / (2 * camera.zoom);

  return {
    left: camera.x - halfWidth,
    top: camera.y - halfHeight,
    right: camera.x + halfWidth,
    bottom: camera.y + halfHeight,
  };
}

export function rectIntersects(a: Rect, b: Rect, margin = 0): boolean {
  return (
    a.left <= b.right + margin &&
    a.right >= b.left - margin &&
    a.top <= b.bottom + margin &&
    a.bottom >= b.top - margin
  );
}

export function getBoundsCenter(bounds: Rect): { x: number; y: number } {
  return {
    x: (bounds.left + bounds.right) / 2,
    y: (bounds.top + bounds.bottom) / 2,
  };
}

export function zoomAtViewportPoint(
  camera: CameraState,
  viewport: Size,
  point: { x: number; y: number },
  nextZoom: number,
): CameraState {
  const clampedZoom = clampZoom(nextZoom);
  const dx = point.x - viewport.width / 2;
  const dy = point.y - viewport.height / 2;

  const worldX = camera.x + dx / camera.zoom;
  const worldY = camera.y + dy / camera.zoom;

  return {
    x: worldX - dx / clampedZoom,
    y: worldY - dy / clampedZoom,
    zoom: clampedZoom,
  };
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

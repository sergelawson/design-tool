import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Screen, useCanvasStore } from "@/stores/canvasStore";
import { useCanvasCameraStore } from "@/stores/canvasCameraStore";
import {
  easeOutCubic,
  getBoundsCenter,
  getVisibleWorldRect,
  rectIntersects,
  zoomAtViewportPoint,
} from "@/utils/cameraMath";
import { getScreenFrameDimensions } from "@/utils/screenLayout";

import { ScreenFrame } from "./ScreenFrame";
import { ZoomControls } from "./ZoomControls";

const GRID_SIZE = 20;
const ZOOM_STEP = 0.1;
const VISIBILITY_MARGIN = 16;
const AUTO_FOCUS_DURATION_MS = 220;

type ViewportSize = {
  width: number;
  height: number;
};

type WorldRect = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function getScreenWorldRect(screen: Screen): WorldRect {
  const dimensions = getScreenFrameDimensions(screen.designWidth);

  return {
    left: screen.position.x,
    top: screen.position.y,
    right: screen.position.x + dimensions.width,
    bottom: screen.position.y + dimensions.height,
  };
}

function getBoundsForScreens(screens: Screen[]): WorldRect | null {
  if (screens.length === 0) {
    return null;
  }

  let left = Number.POSITIVE_INFINITY;
  let top = Number.POSITIVE_INFINITY;
  let right = Number.NEGATIVE_INFINITY;
  let bottom = Number.NEGATIVE_INFINITY;

  for (const screen of screens) {
    const rect = getScreenWorldRect(screen);
    left = Math.min(left, rect.left);
    top = Math.min(top, rect.top);
    right = Math.max(right, rect.right);
    bottom = Math.max(bottom, rect.bottom);
  }

  return { left, top, right, bottom };
}

export function CanvasWorkspace() {
  const viewportRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const previousScreenIdsRef = useRef<string[]>([]);

  const screens = useCanvasStore((state) => state.screens);
  const updatePosition = useCanvasStore((state) => state.updatePosition);
  const removeScreen = useCanvasStore((state) => state.removeScreen);

  const camera = useCanvasCameraStore((state) => state.camera);
  const setCamera = useCanvasCameraStore((state) => state.setCamera);
  const panBy = useCanvasCameraStore((state) => state.panBy);

  const [viewport, setViewport] = useState<ViewportSize>({ width: 0, height: 0 });
  const [isPanning, setIsPanning] = useState(false);

  const worldTransform = useMemo(
    () =>
      `translate(${viewport.width / 2}px, ${viewport.height / 2}px) scale(${camera.zoom}) translate(${-camera.x}px, ${-camera.y}px)`,
    [camera.x, camera.y, camera.zoom, viewport.height, viewport.width],
  );

  const gridStyle = useMemo(
    () => ({
      backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
      backgroundSize: `${GRID_SIZE * camera.zoom}px ${GRID_SIZE * camera.zoom}px`,
      backgroundPosition: `${viewport.width / 2 - camera.x * camera.zoom}px ${viewport.height / 2 - camera.y * camera.zoom}px`,
    }),
    [camera.x, camera.y, camera.zoom, viewport.height, viewport.width],
  );

  const hasVisibleScreen = useCallback(
    (targetCamera = camera): boolean => {
      if (screens.length === 0 || viewport.width === 0 || viewport.height === 0) {
        return false;
      }

      const visibleRect = getVisibleWorldRect(targetCamera, viewport);

      return screens.some((screen) => {
        const screenRect = getScreenWorldRect(screen);
        return rectIntersects(visibleRect, screenRect, VISIBILITY_MARGIN);
      });
    },
    [camera, screens, viewport],
  );

  const animateCameraTo = useCallback(
    (target: { x: number; y: number; zoom: number }, duration = AUTO_FOCUS_DURATION_MS) => {
      const startCamera = useCanvasCameraStore.getState().camera;
      const startTime = performance.now();

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      const step = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = easeOutCubic(progress);

        setCamera({
          x: startCamera.x + (target.x - startCamera.x) * eased,
          y: startCamera.y + (target.y - startCamera.y) * eased,
          zoom: startCamera.zoom + (target.zoom - startCamera.zoom) * eased,
        });

        if (progress < 1) {
          animationFrameRef.current = window.requestAnimationFrame(step);
          return;
        }

        animationFrameRef.current = null;
      };

      animationFrameRef.current = window.requestAnimationFrame(step);
    },
    [setCamera],
  );

  const focusScreens = useCallback(
    (targetScreens: Screen[], options?: { animated?: boolean; zoom?: number }) => {
      const bounds = getBoundsForScreens(targetScreens);
      if (!bounds) {
        return;
      }

      const center = getBoundsCenter(bounds);
      const targetZoom = options?.zoom ?? useCanvasCameraStore.getState().camera.zoom;

      if (options?.animated === false) {
        setCamera({ x: center.x, y: center.y, zoom: targetZoom });
        return;
      }

      animateCameraTo({ x: center.x, y: center.y, zoom: targetZoom });
    },
    [animateCameraTo, setCamera],
  );

  const recoverIfNothingVisible = useCallback(() => {
    if (screens.length === 0 || isPanning) {
      return;
    }

    if (hasVisibleScreen()) {
      return;
    }

    focusScreens(screens, { animated: true });
  }, [focusScreens, hasVisibleScreen, isPanning, screens]);

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) {
      return;
    }

    const updateViewport = () => {
      setViewport({ width: viewportElement.clientWidth, height: viewportElement.clientHeight });
    };

    updateViewport();

    const resizeObserver = new ResizeObserver(() => {
      updateViewport();
    });

    resizeObserver.observe(viewportElement);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    const previousIds = previousScreenIdsRef.current;
    const previousSet = new Set(previousIds);
    const addedScreens = screens.filter((screen) => !previousSet.has(screen.id));

    previousScreenIdsRef.current = screens.map((screen) => screen.id);

    if (addedScreens.length > 0) {
      focusScreens(addedScreens, { animated: true });
      return;
    }

    recoverIfNothingVisible();
  }, [focusScreens, recoverIfNothingVisible, screens]);

  useEffect(() => {
    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleZoomToPoint = useCallback(
    (nextZoom: number, point: { x: number; y: number }) => {
      if (viewport.width === 0 || viewport.height === 0) {
        return;
      }

      const nextCamera = zoomAtViewportPoint(camera, viewport, point, nextZoom);
      setCamera(nextCamera);
    },
    [camera, setCamera, viewport],
  );

  const handleZoomIn = useCallback(() => {
    handleZoomToPoint(camera.zoom + ZOOM_STEP, { x: viewport.width / 2, y: viewport.height / 2 });
  }, [camera.zoom, handleZoomToPoint, viewport.height, viewport.width]);

  const handleZoomOut = useCallback(() => {
    handleZoomToPoint(camera.zoom - ZOOM_STEP, { x: viewport.width / 2, y: viewport.height / 2 });
  }, [camera.zoom, handleZoomToPoint, viewport.height, viewport.width]);

  const handleResetZoom = useCallback(() => {
    const nextCamera = { ...camera, zoom: 1 };
    setCamera(nextCamera);

    window.requestAnimationFrame(() => {
      if (!hasVisibleScreen(nextCamera)) {
        focusScreens(screens, { animated: true, zoom: 1 });
      }
    });
  }, [camera, focusScreens, hasVisibleScreen, screens, setCamera]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if ((event.target as HTMLElement).closest("[data-screen-frame='true']")) {
        return;
      }

      event.preventDefault();
      setIsPanning(true);

      const pointerId = event.pointerId;
      let lastX = event.clientX;
      let lastY = event.clientY;

      const wrappedPointerMove = (moveEvent: PointerEvent) => {
        const dx = (moveEvent.clientX - lastX) / useCanvasCameraStore.getState().camera.zoom;
        const dy = (moveEvent.clientY - lastY) / useCanvasCameraStore.getState().camera.zoom;
        panBy(-dx, -dy);
        lastX = moveEvent.clientX;
        lastY = moveEvent.clientY;
      };

      const handlePointerUp = () => {
        setIsPanning(false);
        window.removeEventListener("pointermove", wrappedPointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      };

      event.currentTarget.setPointerCapture(pointerId);
      window.addEventListener("pointermove", wrappedPointerMove, { passive: true });
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    },
    [panBy],
  );

  useEffect(() => {
    const viewportElement = viewportRef.current;
    if (!viewportElement) {
      return;
    }

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();

      const rect = viewportElement.getBoundingClientRect();
      const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };

      if (event.ctrlKey || event.metaKey) {
        const intensity = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 0.045 : 0.0025;
        const scale = Math.exp(-event.deltaY * intensity);
        handleZoomToPoint(camera.zoom * scale, point);
        return;
      }

      const zoom = useCanvasCameraStore.getState().camera.zoom;
      panBy(event.deltaX / zoom, event.deltaY / zoom);
    };

    viewportElement.addEventListener("wheel", handleWheel, { passive: false });
    return () => viewportElement.removeEventListener("wheel", handleWheel);
  }, [camera.zoom, handleZoomToPoint, panBy]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey && !event.metaKey) {
        return;
      }

      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement ||
        (target instanceof HTMLElement && target.isContentEditable)
      ) {
        return;
      }

      if (event.key === "=" || event.key === "+") {
        event.preventDefault();
        handleZoomIn();
        return;
      }

      if (event.key === "-" || event.key === "_") {
        event.preventDefault();
        handleZoomOut();
        return;
      }

      if (event.key === "0") {
        event.preventDefault();
        handleResetZoom();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleResetZoom, handleZoomIn, handleZoomOut]);

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={viewportRef}
        className={cn(
          "relative h-full w-full overflow-hidden bg-gray-50",
          isPanning && "cursor-grabbing",
        )}
        onPointerDown={handlePointerDown}
      >
        <div className="absolute inset-0" style={gridStyle} />

        <div
          className="absolute left-0 top-0 h-full w-full origin-top-left"
          style={{ transform: worldTransform, willChange: "transform" }}
        >
          {screens.map((screen) => {
            return (
              <ScreenFrame
                key={screen.id}
                id={screen.id}
                name={screen.name}
                status={screen.status}
                html={screen.html}
                position={screen.position}
                designWidth={screen.designWidth}
                zoom={camera.zoom}
                onUpdatePosition={updatePosition}
                onRemove={removeScreen}
              />
            );
          })}
        </div>
      </div>

      <ZoomControls
        zoom={camera.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
      />
    </div>
  );
}

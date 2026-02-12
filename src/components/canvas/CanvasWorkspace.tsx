import { useEffect, useRef, useState } from "react";
import { useCanvasStore } from "@/stores/canvasStore";
import { ScreenFrame } from "./ScreenFrame";
import { ZoomControls } from "./ZoomControls";
import { cn } from "@/lib/utils";

const CANVAS_SIZE = 8000; // Large canvas size for infinite feel
const CENTER_OFFSET = CANVAS_SIZE / 2;

export function CanvasWorkspace() {
  const containerRef = useRef<HTMLDivElement>(null);
  const screens = useCanvasStore((state) => state.screens);
  const addScreen = useCanvasStore((state) => state.addScreen);
  const zoom = useCanvasStore((state) => state.zoom);
  const zoomIn = useCanvasStore((state) => state.zoomIn);
  const zoomOut = useCanvasStore((state) => state.zoomOut);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Center the canvas on mount
  useEffect(() => {
    if (containerRef.current) {
      const { clientWidth, clientHeight } = containerRef.current;
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTo({
            left: CENTER_OFFSET - clientWidth / 2,
            top: CENTER_OFFSET - clientHeight / 2,
            behavior: "auto", // Immediate jump without animation
          });
        }
      }, 10);
    }
  }, []);

  // Handle zoom with Ctrl + Wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          zoomIn();
        } else {
          zoomOut();
        }
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [zoomIn, zoomOut]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    // Calculate drop position relative to the canvas center
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const scrollLeft = containerRef.current.scrollLeft;
      const scrollTop = containerRef.current.scrollTop;

      // Adjust for zoom:
      // The visual distance from center is (screen - center_offset).
      // We divide by zoom to get the world coordinate.
      const rawX = e.clientX - rect.left + scrollLeft - CENTER_OFFSET;
      const rawY = e.clientY - rect.top + scrollTop - CENTER_OFFSET;

      const x = rawX / zoom;
      const y = rawY / zoom;

      // Placeholder: Create a new screen at drop location
      // In a real app, we'd check what's being dropped
      const newScreenId = crypto.randomUUID();
      addScreen({
        id: newScreenId,
        name: `Screen ${screens.length + 1}`,
        status: "loading",
        html: "",
        position: { x, y },
      });

      // Simulate loading for demo purposes
      setTimeout(() => {
        useCanvasStore.getState().updateScreen(newScreenId, {
          status: "ready",
          html: `<div style="padding: 20px; font-family: sans-serif;">
            <h1 class="text-2xl font-bold mb-4">New Screen</h1>
            <p class="text-gray-600">This is a placeholder for AI-generated content.</p>
            <button class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">Click Me</button>
          </div>`,
        });
      }, 2000);
    }
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        className="relative h-full w-full overflow-auto bg-gray-50"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div
          className={cn(
            "relative min-h-full min-w-full transition-colors",
            isDraggingOver ? "bg-blue-50/50" : "",
          )}
          style={{
            backgroundImage: "radial-gradient(#cbd5e1 1px, transparent 1px)",
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`, // Scale grid with zoom
          }}
        >
          {/* Render content relative to center */}
          <div
            className="absolute left-1/2 top-1/2 origin-center"
            style={{
              transform: `translate(-50%, -50%) scale(${zoom})`,
            }}
          >
            {/*
                We render screens relative to the center point.
                This means a screen at {x:0, y:0} will be at the exact center of the large canvas.
            */}
            {screens.map((screen) => {
              return <ScreenFrame key={screen.id} {...screen} />;
            })}
          </div>
        </div>
      </div>
      <ZoomControls />
    </div>
  );
}

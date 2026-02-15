import { Minus, Plus, RotateCcw } from "lucide-react";

interface ZoomControlsProps {
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
}

export function ZoomControls({ zoom, onZoomIn, onZoomOut, onResetZoom }: ZoomControlsProps) {
  return (
    <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-lg border border-gray-200 bg-white/90 p-2 shadow-lg backdrop-blur-sm">
      <button
        onClick={onZoomOut}
        className="rounded p-1.5 text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
        title="Zoom Out (Ctrl/Cmd + -)"
        aria-label="Zoom Out"
      >
        <Minus size={16} />
      </button>

      <span className="w-12 select-none text-center text-sm font-medium text-gray-700">
        {Math.round(zoom * 100)}%
      </span>

      <button
        onClick={onZoomIn}
        className="rounded p-1.5 text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
        title="Zoom In (Ctrl/Cmd + +)"
        aria-label="Zoom In"
      >
        <Plus size={16} />
      </button>

      <div className="mx-1 h-4 w-px bg-gray-300" />

      <button
        onClick={onResetZoom}
        className="rounded p-1.5 text-gray-700 transition-colors hover:bg-gray-100 active:bg-gray-200"
        title="Reset Zoom (Ctrl/Cmd + 0)"
        aria-label="Reset Zoom"
      >
        <RotateCcw size={16} />
      </button>
    </div>
  );
}

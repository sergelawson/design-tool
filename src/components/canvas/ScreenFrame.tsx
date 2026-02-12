import { ScreenStatus, Position } from "@/stores/canvasStore";
import { cn } from "@/lib/utils";
import {
  GripVertical,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  Copy,
  Download,
  Check,
} from "lucide-react";
import { useCanvasStore } from "@/stores/canvasStore";
import { useState } from "react";

interface ScreenFrameProps {
  id: string;
  name: string;
  status: ScreenStatus;
  html: string;
  position: Position;
}

export function ScreenFrame({ id, name, status, html, position }: ScreenFrameProps) {
  const removeScreen = useCanvasStore((state) => state.removeScreen);
  const updatePosition = useCanvasStore((state) => state.updatePosition);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button")) return;

    e.preventDefault();
    setIsDragging(true);
    const startX = e.clientX;
    const startY = e.clientY;
    const startPos = { ...position };

    const handlePointerMove = (e: PointerEvent) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      updatePosition(id, {
        x: startPos.x + dx,
        y: startPos.y + dy,
      });
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy HTML:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const statusIcon = {
    loading: <Loader2 className="h-4 w-4 animate-spin text-blue-500" />,
    ready: <CheckCircle className="h-4 w-4 text-green-500" />,
    error: <AlertCircle className="h-4 w-4 text-red-500" />,
  };

  return (
    <div
      className={cn(
        "absolute z-10 flex h-[667px] w-[375px] flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg transition-shadow hover:shadow-xl",
        status === "loading" && "opacity-80",
        isDragging && "scale-[1.01] cursor-grabbing shadow-2xl",
      )}
      style={{
        left: position.x,
        top: position.y,
        cursor: "default",
      }}
    >
      {/* Header */}
      <div
        className="handle flex cursor-move select-none items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2"
        onPointerDown={handlePointerDown}
      >
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="max-w-[200px] truncate text-sm font-medium text-gray-700">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {status === "ready" && (
            <>
              <button
                onClick={handleCopy}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                title="Copy HTML"
                aria-label="Copy HTML"
              >
                {isCopied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={handleDownload}
                className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
                title="Download HTML"
                aria-label="Download HTML"
              >
                <Download className="h-4 w-4" />
              </button>
              <div className="mx-1 h-4 w-px bg-gray-300" />
            </>
          )}
          {statusIcon[status]}
          <button
            onClick={() => removeScreen(id)}
            className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600"
            aria-label="Remove screen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative flex-1 overflow-hidden bg-white">
        {status === "loading" ? (
          <div className="flex h-full items-center justify-center text-gray-400">Generating...</div>
        ) : status === "error" ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-center text-red-500">
            <AlertCircle className="h-8 w-8" />
            <span className="text-sm">Failed to generate screen content.</span>
          </div>
        ) : (
          <iframe
            srcDoc={html}
            title={name}
            className="h-full w-full border-0 bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
            style={{ display: "block", minHeight: "100%" }}
          />
        )}
      </div>
    </div>
  );
}

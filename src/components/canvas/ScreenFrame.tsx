import { ScreenStatus, Position } from "@/stores/canvasStore";
import { cn } from "@/lib/utils";
import { GripVertical, X, CheckCircle, AlertCircle, Loader2, Copy, Download, Check } from "lucide-react";
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
  const [isCopied, setIsCopied] = useState(false);

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
        "absolute flex flex-col overflow-hidden rounded-xl bg-white shadow-lg border border-gray-200 w-[375px] h-[667px] transition-shadow hover:shadow-xl",
        status === "loading" && "opacity-80"
      )}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        cursor: "default",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-3 py-2 handle cursor-move select-none">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700 truncate max-w-[200px]">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          {status === "ready" && (
            <>
              <button
                onClick={handleCopy}
                className="rounded p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy HTML"
                aria-label="Copy HTML"
              >
                {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="rounded p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
                title="Download HTML"
                aria-label="Download HTML"
              >
                <Download className="h-4 w-4" />
              </button>
              <div className="h-4 w-px bg-gray-300 mx-1" />
            </>
          )}
          {statusIcon[status]}
          <button
            onClick={() => removeScreen(id)}
            className="rounded p-1 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Remove screen"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden relative bg-white">
        {status === "loading" ? (
          <div className="flex h-full items-center justify-center text-gray-400">
            Generating...
          </div>
        ) : status === "error" ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-red-500 p-4 text-center">
            <AlertCircle className="h-8 w-8" />
            <span className="text-sm">Failed to generate screen content.</span>
          </div>
        ) : (
          <iframe
            srcDoc={html}
            title={name}
            className="h-full w-full border-0"
            sandbox="allow-scripts"
          />
        )}
      </div>
    </div>
  );
}

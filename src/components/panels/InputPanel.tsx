import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button, Textarea, Label } from "@/components/ui";
import { Wand2 } from "lucide-react";
import { parsePrompt } from "@/utils/promptParser";
import { mcpClient } from "@/services/mcpClient";
import { wsClient } from "@/services/wsClient";

export function InputPanel() {
  const { prompt, setPrompt, isGenerating, setIsGenerating } = useProjectStore();

  useEffect(() => {
    wsClient.connect();
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);

    const parsedScreens = parsePrompt(prompt);

    const screensToSend = parsedScreens.map((screen) => ({
      ...screen,
      id: crypto.randomUUID(),
    }));

    const screensToAdd = screensToSend.map((screen, index) => ({
      id: screen.id,
      name: screen.name,
      status: "loading" as const,
      html: "",
      position: { x: -450 + index * 300, y: -300 },
    }));
    useCanvasStore.getState().addScreens(screensToAdd);
    console.log(
      "[InputPanel] Added screens to canvas:",
      screensToAdd.map((s) => s.id),
    );

    mcpClient.generateScreens(prompt, screensToSend);

    // Allow new generations while current one processes
    setIsGenerating(false);
  };

  return (
    <div className="flex h-full w-80 flex-col border-r border-slate-200 bg-white p-4">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Design Project</h2>
        <p className="text-sm text-slate-500">Describe your screens to generate UI.</p>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid gap-2">
          <Label htmlFor="prompt">Screen Description</Label>
          <Textarea
            id="prompt"
            placeholder="E.g. Login screen with email, password, and social login buttons..."
            className="min-h-[200px] resize-none"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-4">
        <Button
          className="w-full"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
          isLoading={isGenerating}
        >
          <Wand2 className="mr-2 h-4 w-4" />
          Generate Screens
        </Button>
      </div>
    </div>
  );
}

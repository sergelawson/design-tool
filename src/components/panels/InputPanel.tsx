import { useEffect } from "react";
import { useProjectStore } from "@/stores/projectStore";
import { useCanvasStore } from "@/stores/canvasStore";
import { Button, Textarea, Label } from "@/components/ui";
import { Wand2 } from "lucide-react";
import { parsePrompt } from "@/utils/promptParser";
import { mcpClient } from "@/services/mcpClient";
import { wsClient } from "@/services/wsClient";

export function InputPanel() {
  const {
    prompt,
    setPrompt,
    isGenerating,
    setIsGenerating,
    selectedModel,
    setSelectedModel,
    deviceType,
    setDeviceType,
  } = useProjectStore();

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
      deviceType,
    }));

    const screensToAdd = screensToSend.map((screen, index) => ({
      id: screen.id,
      name: screen.name,
      status: "loading" as const,
      html: "",
      position: { x: -450 + index * 300, y: -300 },
      designWidth: (deviceType === "desktop" ? 1280 : 375) as 375 | 1280,
    }));
    useCanvasStore.getState().addScreens(screensToAdd);
    console.log(
      "[InputPanel] Added screens to canvas:",
      screensToAdd.map((s) => s.id),
    );

    mcpClient.generateScreens(prompt, screensToSend, selectedModel);

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
          <Label htmlFor="model">Model</Label>
          <select
            id="model"
            className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as "gpt-5.2" | "gemini-3-pro")}
          >
            <option value="gpt-5.2">OpenAI GPT-5.2</option>
            <option value="gemini-3-pro">Google Gemini 3 Pro</option>
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="deviceType">Device Type</Label>
          <select
            id="deviceType"
            className="flex h-9 w-full rounded-md border border-slate-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
            value={deviceType}
            onChange={(e) => setDeviceType(e.target.value as "mobile" | "desktop")}
          >
            <option value="mobile">Mobile (375px)</option>
            <option value="desktop">Desktop (1280px)</option>
          </select>
        </div>

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

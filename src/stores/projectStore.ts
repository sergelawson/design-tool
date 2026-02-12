import { create } from "zustand";

interface ProjectState {
  prompt: string;
  isGenerating: boolean;
  selectedModel: "gpt-5.2" | "gemini-3-pro";
  deviceType: "mobile" | "desktop";
  setPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setSelectedModel: (model: "gpt-5.2" | "gemini-3-pro") => void;
  setDeviceType: (deviceType: "mobile" | "desktop") => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  prompt: "",
  isGenerating: false,
  selectedModel: "gpt-5.2",
  deviceType: "mobile",
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setDeviceType: (deviceType) => set({ deviceType }),
}));

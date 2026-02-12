import { create } from "zustand";

interface ProjectState {
  prompt: string;
  isGenerating: boolean;
  selectedModel: "gpt-5.2" | "gemini-3-pro";
  setPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
  setSelectedModel: (model: "gpt-5.2" | "gemini-3-pro") => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  prompt: "",
  isGenerating: false,
  selectedModel: "gpt-5.2",
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
}));

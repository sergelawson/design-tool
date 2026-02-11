import { create } from "zustand";

interface ProjectState {
  prompt: string;
  isGenerating: boolean;
  setPrompt: (prompt: string) => void;
  setIsGenerating: (isGenerating: boolean) => void;
}

export const useProjectStore = create<ProjectState>((set) => ({
  prompt: "",
  isGenerating: false,
  setPrompt: (prompt) => set({ prompt }),
  setIsGenerating: (isGenerating) => set({ isGenerating }),
}));

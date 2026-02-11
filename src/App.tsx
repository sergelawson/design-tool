import { CanvasWorkspace } from "@/components/canvas/CanvasWorkspace";
import { InputPanel } from "@/components/panels/InputPanel";

function App() {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <InputPanel />
      <div className="flex-1 h-full relative">
        <CanvasWorkspace />
      </div>
    </div>
  );
}

export default App;

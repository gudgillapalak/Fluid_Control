import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// ✅ IMPORT CONTEXT
import { ProjectProvider } from "@/contexts/ProjectContext";

createRoot(document.getElementById("root")!).render(
  <ProjectProvider>
    <App />
  </ProjectProvider>
);


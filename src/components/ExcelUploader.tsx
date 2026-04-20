import { createContext, useContext, useEffect, useState } from "react";

const ProjectContext = createContext<any>(null);

export const ProjectProvider = ({ children }: any) => {
  const [projects, setProjects] = useState<any[]>([]);

  // ✅ Load from localStorage on start
  useEffect(() => {
    const saved = localStorage.getItem("projects");
    if (saved) {
      setProjects(JSON.parse(saved));
    }
  }, []);

  // ✅ Save to localStorage whenever projects change
  useEffect(() => {
    localStorage.setItem("projects", JSON.stringify(projects));
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectData = () => useContext(ProjectContext);
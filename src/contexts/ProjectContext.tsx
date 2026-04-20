import { createContext, useContext, useEffect, useState } from "react";

const ProjectContext = createContext<any>(null);

export const ProjectProvider = ({ children }: any) => {

  // ✅ LOAD FROM LOCALSTORAGE INITIALLY
  const [projects, setProjects] = useState<any[]>(() => {
    const saved = localStorage.getItem("projects");
    return saved ? JSON.parse(saved) : [];
  });

  // ✅ SAVE EVERY TIME PROJECTS CHANGE
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem("projects", JSON.stringify(projects));
    }
  }, [projects]);

  return (
    <ProjectContext.Provider value={{ projects, setProjects }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectData = () => useContext(ProjectContext);
import { createContext, useState } from "react";

export const DataContext = createContext<any>(null);

export const DataProvider = ({ children }: any) => {
  const [employees, setEmployees] = useState<any[]>([]);

  return (
    <DataContext.Provider value={{ employees, setEmployees }}>
      {children}
    </DataContext.Provider>
  );
};
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface AppContextType {
  targetAddress: string | null;
  setTargetAddress: (address: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [targetAddress, setTargetAddressState] = useState<string | null>(null);

  // Cargar targetAddress desde localStorage al iniciar
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("targetAddress");
      if (stored) {
        setTargetAddressState(stored);
      }
    }
  }, []);

  const setTargetAddress = (address: string | null) => {
    setTargetAddressState(address);
    if (typeof window !== "undefined") {
      if (address) {
        localStorage.setItem("targetAddress", address);
      } else {
        localStorage.removeItem("targetAddress");
      }
    }
  };

  return (
    <AppContext.Provider value={{ targetAddress, setTargetAddress }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export default AppContext;

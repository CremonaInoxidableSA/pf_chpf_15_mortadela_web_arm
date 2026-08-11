"use client";

import { createContext, useState, useContext, ReactNode } from "react";

interface NetworkContextType {
  clientIP: string | null;
  targetAddress: string | null;
  baseURL: string | null;
  loginURL: string | null;
  redirectURL: string | null;
  camarasURL: string | null;
  mediaMTXBaseURL: string | null;
  isLoading: boolean;
}

interface NetworkProviderProps {
  children: ReactNode;
}

const defaultNetworkState: NetworkContextType = {
  clientIP: null,
  targetAddress: null,
  baseURL: null,
  loginURL: null,
  redirectURL: null,
  camarasURL: null,
  mediaMTXBaseURL: null,
  isLoading: true,
};

const resolveNetworkConfig = (hostname: string) => {
  if (hostname.startsWith("192.168.")) {
    const parts = hostname.split(".");

    if (parts.length === 4) {
      const frontIP = "192.168.20.150";

      return {
        clientIP: hostname,
        targetAddress: frontIP,
        baseURL: `http://${frontIP}:3000`,
        loginURL: `http://${frontIP}:3000`,
        redirectURL: `http://${frontIP}:3000`,
        camarasURL: `http://${hostname}:3000/camaras`,
        mediaMTXBaseURL: `http://${hostname}:8888`,
      };
    }
  }

  return {
    clientIP: hostname,
    targetAddress: "localhost",
    baseURL: "http://localhost:3000",
    loginURL: "http://localhost:3000",
    redirectURL: "http://localhost:3000",
    camarasURL: "http://localhost:3000/camaras",
    mediaMTXBaseURL: "http://localhost:8888",
  };
};

const getInitialNetworkState = (): NetworkContextType => {
  if (typeof window === "undefined") {
    return defaultNetworkState;
  }

  const storedBase = sessionStorage.getItem("baseURL");
  const storedLogin = sessionStorage.getItem("loginURL");
  const storedRedirect = sessionStorage.getItem("redirectURL");
  const storedCamaras = sessionStorage.getItem("camarasURL");
  const storedMediaMTX = sessionStorage.getItem("mediaMTXBaseURL");
  const storedClientIP = sessionStorage.getItem("clientIP");
  const storedTargetAddress = sessionStorage.getItem("targetAddress");

  if (
    storedBase &&
    storedLogin &&
    storedRedirect &&
    storedCamaras &&
    storedMediaMTX
  ) {
    return {
      clientIP: storedClientIP,
      targetAddress: storedTargetAddress,
      baseURL: storedBase,
      loginURL: storedLogin,
      redirectURL: storedRedirect,
      camarasURL: storedCamaras,
      mediaMTXBaseURL: storedMediaMTX,
      isLoading: false,
    };
  }

  const config = resolveNetworkConfig(window.location.hostname);

  sessionStorage.setItem("baseURL", config.baseURL);
  sessionStorage.setItem("loginURL", config.loginURL);
  sessionStorage.setItem("redirectURL", config.redirectURL);
  sessionStorage.setItem("camarasURL", config.camarasURL);
  sessionStorage.setItem("mediaMTXBaseURL", config.mediaMTXBaseURL);
  sessionStorage.setItem("clientIP", config.clientIP);
  sessionStorage.setItem("targetAddress", config.targetAddress);

  return {
    ...config,
    isLoading: false,
  };
};

const NetworkContext = createContext<NetworkContextType>({
  ...defaultNetworkState,
});

export const useNetwork = () => useContext(NetworkContext);

export const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [networkState] = useState<NetworkContextType>(getInitialNetworkState);

  const contextValue: NetworkContextType = networkState;

  return (
    <NetworkContext.Provider value={contextValue}>
      {children}
    </NetworkContext.Provider>
  );
};

export default NetworkContext;

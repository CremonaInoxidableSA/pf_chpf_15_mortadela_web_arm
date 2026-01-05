"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { UserSession } from "@/lib/types";

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<ApiResponse>;
  register: (data: RegisterData) => Promise<ApiResponse>;
  logout: () => Promise<void>;
}

interface ApiResponse {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: "admin" | "user";
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Verificar sesión al cargar
  const [needBootstrap, setNeedBootstrap] = useState(false);

  useEffect(() => {
    checkSession();
  }, []);

  // Redirigir si no está autenticado en rutas protegidas o si se necesita bootstrap
  useEffect(() => {
    if (!loading) {
      const publicRoutes = ["/login", "/register", "/bootstrap"];
      const isPublicRoute = publicRoutes.some((route) =>
        pathname?.startsWith(route)
      );

      // Si se necesita bootstrap, forzar a /bootstrap
      if (needBootstrap && pathname !== "/bootstrap") {
        router.push("/bootstrap");
        return;
      }

      if (!user && !isPublicRoute && pathname !== "/") {
        router.push("/login");
      }

      if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/");
      }
    }
  }, [user, loading, needBootstrap, pathname, router]);

  const checkSession = async () => {
    try {
      const response = await fetch("/api/auth/check", {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          // Si la API indica que no hay usuarios, marcar necesidad de bootstrap
          if (data.data && data.data.needBootstrap) {
            setNeedBootstrap(true);
            setLoading(false);
            return;
          }

          // No se necesita bootstrap
          setNeedBootstrap(false);

          if (data.data && data.data.user) {
            setUser(data.data.user);
          }
        }
      }
    } catch (error) {
      console.error("Session check error:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (
    username: string,
    password: string
  ): Promise<ApiResponse> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.data.user);
        // Clear bootstrap requirement after login
        setNeedBootstrap(false);
        router.push("/");
      }

      return data;
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: "Error de conexión" };
    }
  };

  const register = async (data: RegisterData): Promise<ApiResponse> => {
    // Registro vía aplicación no soportado; el único usuario inicial debe crearse mediante el bootstrap (superadmin)
    return {
      success: false,
      error: "Registro no disponible. Contacte al administrador.",
    };
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

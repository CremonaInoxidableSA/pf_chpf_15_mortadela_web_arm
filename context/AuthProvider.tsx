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
  email: string | null;
  username: string | null;
  nombre: string | null;
  apellido: string | null;
  rol: string | null;
  habilitado: boolean | null;
  reporte: boolean | null;
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
  username: UserSession;
  nombre: string;
  apellido: string;
  rol: "admin" | "user";
  habilitado: boolean;
  reporte: boolean;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [nombre, setNombre] = useState<string | null>(null);
  const [apellido, setApellido] = useState<string | null>(null);
  const [rol, setRol] = useState<string | null>(null);
  const [habilitado, setHabilitado] = useState<boolean | null>(null);
  const [reporte, setReporte] = useState<boolean | null>(null);
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

  // Mantener los campos individuales sincronizados con `user`
  useEffect(() => {
    if (user) {
      setEmail(user.email ?? null);
      setUsername(user.username ?? null);
      setNombre(user.nombre ?? null);
      setApellido(user.apellido ?? null);
      setRol(user.rol ?? null);
      // Convertir flags numéricos (1/0) o booleanos a booleanos
      setHabilitado(!!user.habilitado);
      setReporte(!!user.reporte);
    } else {
      setEmail(null);
      setUsername(null);
      setNombre(null);
      setApellido(null);
      setRol(null);
      setHabilitado(null);
      setReporte(null);
    }
  }, [user]);

  const checkSession = async () => {
    try {
      // Si guardamos el token en localStorage como respaldo, enviarlo en el header Authorization
      let headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      try {
        if (typeof window !== "undefined") {
          const token = localStorage.getItem("access_token");
          if (token) {
            headers["Authorization"] = `Bearer ${token}`;
          }
        }
      } catch (e) {
        console.warn("Could not access localStorage during session check", e);
      }

      const response = await fetch("/api/auth/check", {
        credentials: "include",
        headers,
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
            const incomingUser = data.data.user;
            // Normalizar si la API devuelve un array con el usuario
            if (Array.isArray(incomingUser) && incomingUser.length > 0) {
              setUser(incomingUser[0]);
            } else {
              setUser(incomingUser);
            }
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
        // Guardar token en localStorage para que peticiones cliente puedan usarlo
        const token = data.data?.token;
        try {
          if (token && typeof window !== "undefined") {
            localStorage.setItem("access_token", token);
          }
        } catch (e) {
          console.warn("Could not store access_token in localStorage", e);
        }

        // Incluir token en el objeto user en memoria
        const incomingUser = data.data?.user;
        const userObj = Array.isArray(incomingUser)
          ? incomingUser[0]
          : incomingUser;
        setUser({ ...(userObj || {}), token });

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
      try {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
        }
      } catch (e) {
        console.warn("Could not remove access_token from localStorage", e);
      }
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        email,
        username,
        nombre,
        apellido,
        habilitado,
        rol,
        reporte,
        loading,
        login,
        register,
        logout,
      }}
    >
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

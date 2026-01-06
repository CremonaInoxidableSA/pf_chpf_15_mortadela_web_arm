"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthProvider";
import { Button } from "@/components/ui/button";

const BootstrapPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Verificar que realmente se necesite bootstrap
    (async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();

        if (!(data?.success && data?.data?.needBootstrap)) {
          // Ya no se necesita bootstrap, redirigir a login
          router.push("/login");
        }
      } catch (err) {
        console.error("Check bootstrap error:", err);
        router.push("/login");
      }
    })();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const body: any = { email, password, username, nombre, apellido };

      const headers: any = { "Content-Type": "application/json" };
      if (secret) headers["x-bootstrap-secret"] = secret;

      const res = await fetch("/api/auth/bootstrap", {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (!result.success) {
        setError(result.error || result.message || "Error al crear usuario");
        setLoading(false);
        return;
      }

      // Intentar login automático usando AuthProvider para que el estado se actualice
      const loginResult = await login(username, password);

      if (loginResult.success) {
        // AuthProvider limpia la necesidad de bootstrap y redirige
        router.push("/");
      } else {
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Error al crear superadmin");
      setLoading(false);
    }
  };

  return (
    <section className="flex h-full w-full items-center justify-center">
      <div className="w-auto gap-3.75 flex flex-col items-center p-6 max-w-md bg-backgroundoscuro rounded-lg">
        <h2 className="text-2xl font-semibold">Crear Superadmin inicial</h2>
        <p className="text-sm text-muted-foreground">
          No hay usuarios en la base de datos. Por favor, crea el usuario
          administrador de Creminox.
        </p>

        <form className="w-full mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2 mb-2">
            <label>User</label>
            <input
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label>Email</label>
            <input
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label>Nombre</label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label>Apellido</label>
            <input
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 mb-2">
            <label>Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
            />
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <label>Bootstrap Secret (si aplica)</label>
            <input
              placeholder="Si BOOTSTRAP_SECRET está configurado"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              className="input"
            />
          </div>

          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
    
          <Button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading ? "Creando..." : "Crear Superadmin"}
          </Button>
        </form>
      </div>
    </section>
  );
};

export default BootstrapPage;

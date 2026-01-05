"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";

interface ConfigParam {
  id: number;
  param_name: string;
  param_value: string;
  description?: string;
}

export default function ConfigTable() {
  const { user } = useAuth();
  const [params, setParams] = useState<ConfigParam[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchParams();
  }, []);

  const fetchParams = async () => {
    try {
      const response = await fetch("/api/config", {
        credentials: "include",
      });
      const data = await response.json();

      if (data.success) {
        setParams(data.data);
      }
    } catch (error) {
      console.error("Error fetching params:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editValue.trim()) return;

    try {
      const response = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, param_value: editValue }),
        credentials: "include",
      });

      const data = await response.json();

      if (data.success) {
        setMessage("Parámetro actualizado correctamente");
        setTimeout(() => setMessage(""), 3000);
        await fetchParams();
        setEditingId(null);
      } else {
        setMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      setMessage("Error de conexión");
    }
  };

  if (loading) {
    return <div className="text-center py-4">Cargando parámetros...</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b">
        <h3 className="text-lg font-medium text-gray-900">
          Parámetros de Configuración
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          {user?.role === "admin"
            ? "Puedes editar los valores de configuración"
            : "Solo lectura - Contacta al administrador para cambios"}
        </p>
      </div>

      {message && (
        <div
          className={`px-6 py-3 ${message.includes("Error") ? "bg-red-50 text-red-700" : "bg-green-50 text-green-700"}`}
        >
          {message}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Parámetro
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
              {user?.role === "admin" && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {params.map((param) => (
              <tr key={param.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {param.param_name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {param.description || "Sin descripción"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {editingId === param.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="border rounded px-2 py-1 w-full"
                      autoFocus
                    />
                  ) : (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {param.param_value}
                    </span>
                  )}
                </td>
                {user?.role === "admin" && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {editingId === param.id ? (
                      <div className="space-x-2">
                        <button
                          onClick={() => handleUpdate(param.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Guardar
                        </button>
                        <button
                          onClick={() => {
                            setEditingId(null);
                            setEditValue("");
                          }}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingId(param.id);
                          setEditValue(param.param_value);
                        }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Editar
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

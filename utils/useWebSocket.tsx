"use client";
import { useEffect, useState, useRef, useCallback } from "react";

import {
  WebSocketResponse,
  MachineStatus,
  ProcessData,
  TechnicalData,
  Alarm,
} from "@/types/websocket";

interface UseWebSocketReturn {
  data: WebSocketResponse | null;
  isConnected: boolean;
  error: Error | null;
  reconnect: () => void;
}

export default function useWebSocket(pollId: string): UseWebSocketReturn {
  const [data, setData] = useState<WebSocketResponse | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const connectRef = useRef<() => void>(() => {});

  const connect = useCallback(() => {
    try {
      const target = localStorage.getItem("targetAddress");

      if (
        !target ||
        target === "undefined:undefined" ||
        target.includes("undefined")
      ) {
        setError(new Error("Target address not available or invalid"));

        return;
      }
      const wsUrl = `ws://${target}/ws/${pollId}`;
      const socket = new WebSocket(wsUrl);

      socketRef.current = socket;

      socket.onopen = () => {
        setIsConnected(true);
        setError(null);

        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }
      };

      socket.onmessage = (event: MessageEvent) => {
        if (
          socketRef.current !== socket ||
          socket.readyState !== WebSocket.OPEN
        ) {
          return;
        }

        try {
          const rawData = JSON.parse(event.data);

          if (Array.isArray(rawData) && rawData.length >= 5) {
            const formattedData: WebSocketResponse = {
              machineStatus: rawData[0] as MachineStatus,
              processData: rawData[1] as ProcessData,
              technicalData: rawData[2] as TechnicalData,
              alarms: (rawData[3] as Alarm[]).slice(-50),
              extraData: (rawData[4] as unknown[]).slice(-100),
            };

            setData(formattedData);
          }
        } catch (err) {
          setError(new Error(`Failed to parse WebSocket data: ${err}`));
        }
      };

      socket.onclose = () => {
        if (socketRef.current !== socket) {
          return;
        }
        setIsConnected(false);
        socketRef.current = null;

        reconnectTimeoutRef.current = setTimeout(() => {
          connectRef.current();
        }, 3000);
      };

      socket.onerror = () => {
        setError(new Error("WebSocket connection error"));
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  }, [pollId]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  useEffect(() => {
    const initialConnectTimeout = setTimeout(() => {
      connectRef.current();
    }, 0);

    return () => {
      clearTimeout(initialConnectTimeout);

      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
    };
  }, [connect]);

  const reconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    connect();
  }, [connect]);

  return { data, isConnected, error, reconnect };
}

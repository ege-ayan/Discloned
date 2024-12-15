"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

let socketInstance: Socket | null = null;

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socketInstance) {
      console.log("Creating a new socket connection...");
      socketInstance = io(process.env.NEXT_PUBLIC_SITE_URL!, {
        path: "/api/socket/io",
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });
    } else {
      console.log("Reusing existing socket connection...");
    }

    const handleConnect = () => {
      console.log("✅ Socket connected");
      setIsConnected(true);
    };

    const handleDisconnect = () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    };

    if (!socketInstance.hasListeners("connect")) {
      socketInstance.on("connect", handleConnect);
      socketInstance.on("disconnect", handleDisconnect);
    }

    return () => {
      console.log("Cleaning up listeners...");
      socketInstance?.off("connect", handleConnect);
      socketInstance?.off("disconnect", handleDisconnect);
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket: socketInstance, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};

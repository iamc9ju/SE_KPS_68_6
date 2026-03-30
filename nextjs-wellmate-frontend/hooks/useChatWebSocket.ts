"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/store/auth-store";

const SOCKET_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/api$/, "");

export const useChatWebSocket = (chatRoomId: string | null) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((state) => state.user);

  // 1. Connection management (once per user)
  useEffect(() => {
    if (!user) return;

    console.log("🔌 Connecting to chat socket...");
    const socket = io(`${SOCKET_URL}/chat`, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected to chat socket:", socket.id);
      setIsConnected(true);
      setError(null);
      // If we already have a room selected, join it immediately
      if (chatRoomId) {
        socket.emit("join_room", { chatRoomId });
      }
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
      setError(`Connection failed: ${err.message}`);
      setIsConnected(false);
    });

    socket.on("error", (err: { message: string }) => {
      console.error("❌ Socket error:", err.message);
      setError(err.message);
    });

    socket.on("disconnect", (reason) => {
      console.log("🔌 Socket disconnected:", reason);
      setIsConnected(false);
    });

    return () => {
      console.log("🔌 Disconnecting socket...");
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [user]); // Only reconnect if user changes

  // 2. Room switching management
  useEffect(() => {
    const socket = socketRef.current;
    if (socket && isConnected && chatRoomId) {
      console.log(`🏠 Joining room: ${chatRoomId}`);
      socket.emit("join_room", { chatRoomId });
      
      // Optional: leave previous room logic if server doesn't handle it
    }
  }, [chatRoomId, isConnected]);

  const sendMessage = useCallback((content: string, type: "text" | "image" | "file" = "text", callback?: (response: any) => void) => {
    if (socketRef.current && isConnected && chatRoomId) {
      socketRef.current.emit("send_message", {
        chatRoomId,
        content,
        type,
      }, (response: any) => {
        if (callback) callback(response);
      });
    } else {
      console.warn("⚠️ Cannot send message: Socket not connected or no room selected");
    }
  }, [isConnected, chatRoomId]);

  const markAsRead = useCallback(() => {
    if (socketRef.current && isConnected && chatRoomId) {
      socketRef.current.emit("mark_read", { chatRoomId });
    }
  }, [isConnected, chatRoomId]);

  const onNewMessage = useCallback((callback: (message: any) => void) => {
    const socket = socketRef.current;
    if (socket) {
      socket.on("new_message", callback);
      return () => {
        socket.off("new_message", callback);
      };
    }
    return () => {};
  }, []); // Stable callback

  const onMessagesRead = useCallback((callback: (data: any) => void) => {
    const socket = socketRef.current;
    if (socket) {
      socket.on("messages_read", callback);
      return () => {
        socket.off("messages_read", callback);
      };
    }
    return () => {};
  }, []);

  const onRecommendationsUpdated = useCallback((callback: (data: any) => void) => {
    const socket = socketRef.current;
    if (socket) {
      socket.on("recommendations_updated", callback);
      return () => {
        socket.off("recommendations_updated", callback);
      };
    }
    return () => {};
  }, []);

  return {
    isConnected,
    error,
    sendMessage,
    markAsRead,
    onNewMessage,
    onMessagesRead,
    onRecommendationsUpdated,
    socket: socketRef.current,
  };
};

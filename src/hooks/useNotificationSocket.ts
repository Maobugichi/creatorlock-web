"use client";

import { useEffect, useRef } from "react";
import { io, type Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const AUTH_ERROR_MESSAGES = new Set(["No cookie", "No access token", "Authentication failed"]);

export function useNotificationSocket() {
  const queryClient = useQueryClient();
  const hasRetriedRef = useRef(false);

  useEffect(() => {
    hasRetriedRef.current = false;

    const socket: Socket = io(process.env.NEXT_PUBLIC_URL!, {
      withCredentials: true,
    });

    socket.on("notification:new", () => {
      queryClient.invalidateQueries({ queryKey: ["unread-count"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    });

    socket.on("connect", () => {
    
      hasRetriedRef.current = false;
    });

    socket.on("connect_error", async (err) => {
      console.log("connect_error message:", JSON.stringify(err.message));
      const isAuthError = AUTH_ERROR_MESSAGES.has(err.message);

      if (!isAuthError || hasRetriedRef.current) {
        // Not an auth issue, or we already tried refreshing once this mount —
        // let Socket.IO's own backoff keep retrying without us intervening again.
        return;
      }

      hasRetriedRef.current = true;

      try {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );
        // Cookie is refreshed — reconnect using the same socket instance so
        // the next handshake picks up the new accessToken cookie.
        socket.connect();
      } catch {
        
      }
    });

    return () => {
      socket.off("connect_error");
      socket.off("connect");
      socket.off("notification:new");
      socket.disconnect();
    };
  }, [queryClient]);
}
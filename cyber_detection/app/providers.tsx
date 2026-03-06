"use client";

import { SocketProvider } from "@/lib/socket-context";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <SocketProvider>{children}</SocketProvider>;
}

"use client";

import dynamic from "next/dynamic";
import type { ReactNode } from "react";

const ClientProviders = dynamic(
  () => import("./ClientProviders"),
  { ssr: false }
);

export default function ClientProvidersWrapper({ children }: { children: ReactNode }) {
  return <ClientProviders>{children}</ClientProviders>;
}

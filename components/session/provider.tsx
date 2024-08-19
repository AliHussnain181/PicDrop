"use client";

import { SessionProvider } from "next-auth/react";

export const GoogleProvider = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <SessionProvider>{children}</SessionProvider>;
};

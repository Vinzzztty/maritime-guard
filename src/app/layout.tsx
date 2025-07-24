"use client";
import "./globals.css";
import { ReactNode } from "react";
import SessionProviderWrapper from "@/app/components/SessionProviderWrapper";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}

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
      <head>
        <link rel="icon" href="/logo.ico" />
      </head>
      <body>
        <SessionProviderWrapper>{children}</SessionProviderWrapper>
      </body>
    </html>
  );
}

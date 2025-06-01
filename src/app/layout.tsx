
"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useEffect } from "react";
import { useChatStore } from "@/lib/store/useChatStore";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const fetchSession = useAuthStore((state) => state.fetchSession);
	const listenAuthChanges = useAuthStore((state) => state.listenAuthChanges);
  const subscribeToMessages = useChatStore((state) => state.subscribeToMessages);
  
	useEffect(() => {
	  fetchSession();
    subscribeToMessages();
	  const { subscription } = listenAuthChanges();
  
	  return () => subscription.unsubscribe();
	}, [fetchSession, listenAuthChanges, subscribeToMessages]);
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

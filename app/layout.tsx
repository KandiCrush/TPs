import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { HomeIcon } from "lucide-react";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Mes TPS",
    description: "Application regroupant divers travaux pratiques réalisés.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="fr" className="h-screen overflow-hidden">
            <body
                className={`${geistSans.variable} ${geistMono.variable} relative antialiased`}
            >
                <header className="absolute top-2 right-2 flex px-4 bg-background border z-10 rounded-lg shadow-md h-12 items-center hover:shadow-lg transition-shadow cursor-pointor">
                    <Link
                        href={"/"}
                        className="text-lg flex items-center gap-2"
                    >
                        <HomeIcon />
                        Home
                    </Link>
                </header>
                <main>{children}</main>
            </body>
        </html>
    );
}

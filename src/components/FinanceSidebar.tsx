"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/src/lib/utils";
import {
    LayoutDashboard,
    Calculator,
    History,
    FileText,
    Building2,
} from "lucide-react";

const navigation = [
    {
        name: "Tableau de bord",
        href: "/finance",
        icon: LayoutDashboard,
    },
    {
        name: "Nouvelle simulation",
        href: "/finance/simulation",
        icon: Calculator,
    },
    {
        name: "Historique",
        href: "/finance/historique",
        icon: History,
    },
    {
        name: "Documents",
        href: "/finance/documents",
        icon: FileText,
    },
];

export function FinanceSidebar() {
    const pathname = usePathname();

    return (
        <div className="flex h-screen w-64 flex-col border-r bg-card">
            {/* Logo/Header */}
            <div className="flex h-16 items-center border-b px-6">
                <div className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="text-lg font-semibold">
                        Finance Pro
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => {
                    const isActive =
                        pathname === item.href ||
                        (item.href !== "/finance" &&
                            pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            )}
                        >
                            <Icon className="h-5 w-5" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="border-t p-4">
                <p className="text-xs text-muted-foreground">
                    Version 1.0.0
                </p>
            </div>
        </div>
    );
}

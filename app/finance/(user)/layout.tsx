import { FinanceSidebar } from "@/src/components/FinanceSidebar";

export default function FinanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-[calc(100vh-64px)] overflow-hidden">
            <FinanceSidebar />
            <main className="flex-1 overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}

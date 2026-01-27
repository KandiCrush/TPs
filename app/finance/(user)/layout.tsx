import { FinanceSidebar } from "@/src/components/FinanceSidebar";

export default function FinanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <FinanceSidebar />
            <main className="flex-1 min-h-sreen overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}

import { FinanceSidebar } from "@/src/components/FinanceSidebar";
import { getUser } from "@/src/lib/auth-server";
import { redirect } from "next/navigation";

export default async function FinanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = getUser();

    if (!user) {
        redirect("/finance/auth/login");
    }

    return (
        <div className="flex h-screen overflow-hidden">
            <FinanceSidebar />
            <main className="flex-1 min-h-sreen overflow-y-auto bg-background">
                {children}
            </main>
        </div>
    );
}

export default function FinanceLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className="min-h-screen bg-background">{children}</div>;
}

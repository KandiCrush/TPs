// Home page listing various practical works (TPs) with links to their respective pages.

import Link from "next/link";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Folder } from "lucide-react";

const tps = [
    {
        title: "Lois de probabilité",
        description: "Binomiale, Poisson, Hypergéométrique",
        href: "/lois-de-probabilite",
    },
    {
        title: "Finance App",
        description: "Application de finance (simulation de prêt, tableau d'amortissement, etc.)",
        href: "/finance",
    },
    {
        title: "Tableau d’amortissement",
        description: "Calcul de crédit et génération du tableau",
        href: "/tableau-d-amortissement",
    },
];

export default function Page() {
    return (
        <main className="min-h-screen bg-background p-10">
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {tps.map((tp) => (
                    <Link key={tp.href} href={tp.href}>
                        <Card className="cursor-pointer transition hover:shadow-lg">
                            <CardHeader className="flex flex-row items-center gap-3">
                                <Folder className="h-6 w-6 text-muted-foreground" />
                                <CardTitle className="text-lg">
                                    {tp.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-sm text-muted-foreground">
                                {tp.description}
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </main>
    );
}

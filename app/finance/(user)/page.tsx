import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import {
    Calculator,
    History,
    FileText,
    CheckCircle2,
    FileX,
    Edit,
    Plus,
    Eye,
    Copy,
    Trash2,
} from "lucide-react";
import Link from "next/link";
import prisma from "@/src/lib/prisma";
import { getUser } from "@/src/lib/auth-server";
import { unauthorized } from "next/navigation";

type SimulationStatus = "VALIDATED" | "DRAFT" | "DELETED";

const getStatusBadge = (status: SimulationStatus) => {
    const variants = {
        VALIDATED: "default",
        DRAFT: "secondary",
        DELETED: "destructive",
    } as const;

    const labels = {
        VALIDATED: "Validé",
        DRAFT: "Brouillon",
        DELETED: "Supprimé",
    };

    return (
        <Badge variant={variants[status] || "default"}>{labels[status]}</Badge>
    );
};

export default async function DashboardPage() {
    const user = await getUser();
    const operateur = await prisma.operateur.findUnique({
        where: { userId: user?.id },
    });
    if (!operateur) {
        return unauthorized;
    }

    const grouped = await prisma.simulationResult.groupBy({
        by: ["statut"],
        where: {
            simulation: {
                operateurId: operateur.id,
            },
        },
        _count: {
            _all: true,
        },
    });

    const stats = {
        total: 0,
        validated: 0,
        draft: 0,
        deleted: 0,
    };

    grouped.forEach((item) => {
        stats.total += item._count._all;

        if (item.statut === "VALIDATED") {
            stats.validated = item._count._all;
        }

        if (item.statut === "DRAFT") {
            stats.draft = item._count._all;
        }

        if (item.statut === "DELETED") {
            stats.deleted = item._count._all;
        }
    });

    const lastSimulations = await prisma.simulationResult.findMany({
        take: 5,
        orderBy: {
            createdAt: "desc",
        },
        select: {
            id: true,
            montant: true,
            duree: true,
            mensualite: true,
            totalInterets: true,
            totalAssurance: true,
            statut: true,
            createdAt: true,

            simulation: {
                select: {
                    taux: true,
                    typeTaux: true,
                    dateTraitement: true,
                },
            },
        },
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
                <h1 className="text-2xl font-bold">Tableau de bord</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Vue d&apos;ensemble de vos simulations de prêt
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total simulations
                            </CardTitle>
                            <Calculator className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.total}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Toutes simulations confondues
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Validées
                            </CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {stats.validated}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Simulations finalisées
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Brouillons
                            </CardTitle>
                            <Edit className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.draft}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                En cours de modification
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Supprimées
                            </CardTitle>
                            <FileX className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {stats.deleted}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Archivées
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions rapides</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            <Link href="/finance/simulation">
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Nouvelle simulation
                                </Button>
                            </Link>
                            <Link href="/finance/historique">
                                <Button variant="outline">
                                    <History className="mr-2 h-4 w-4" />
                                    Voir l&apos;historique
                                </Button>
                            </Link>
                            <Link href="/finance/documents">
                                <Button variant="outline">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Consulter les documents
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Simulations */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>Simulations récentes</CardTitle>
                            <Link href="/finance/historique">
                                <Button variant="ghost" size="sm">
                                    Voir tout
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {lastSimulations.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                <p>Aucune simulation récente</p>
                                <Link href="/finance/simulation">
                                    <Button variant="outline" className="mt-4">
                                        Créer une simulation
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Montant</TableHead>
                                            <TableHead>Taux</TableHead>
                                            <TableHead>Durée</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {lastSimulations.map((sim) => (
                                            <TableRow key={sim.id}>
                                                <TableCell>
                                                    {new Date(
                                                        sim.createdAt,
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {sim.montant.toLocaleString()}{" "}
                                                    €
                                                </TableCell>
                                                <TableCell>
                                                    {sim.simulation.taux}%
                                                </TableCell>
                                                <TableCell>
                                                    {sim.duree} mois
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(sim.statut)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            title="Voir"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            title="Dupliquer"
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            title="Supprimer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

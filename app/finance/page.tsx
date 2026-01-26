"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
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
    TrendingUp,
    CheckCircle2,
    FileX,
    Edit,
    Plus,
    Eye,
    Copy,
    Trash2,
} from "lucide-react";
import Link from "next/link";

type SimulationStatus = "validated" | "draft" | "deleted";

interface Simulation {
    id: string;
    date: string;
    montant: number;
    taux: number;
    duree: number;
    status: SimulationStatus;
}

// Mock data
const mockStats = {
    total: 24,
    validated: 18,
    draft: 5,
    deleted: 1,
};

const recentSimulations: Simulation[] = [
    {
        id: "1",
        date: "2026-01-26",
        montant: 150000,
        taux: 3.2,
        duree: 240,
        status: "validated",
    },
    {
        id: "2",
        date: "2026-01-25",
        montant: 80000,
        taux: 3.8,
        duree: 180,
        status: "draft",
    },
    {
        id: "3",
        date: "2026-01-24",
        montant: 250000,
        taux: 2.9,
        duree: 300,
        status: "validated",
    },
    {
        id: "4",
        date: "2026-01-23",
        montant: 120000,
        taux: 3.5,
        duree: 240,
        status: "validated",
    },
];

const getStatusBadge = (status: SimulationStatus) => {
    const variants = {
        validated: "default",
        draft: "secondary",
        deleted: "destructive",
    } as const;

    const labels = {
        validated: "Validé",
        draft: "Brouillon",
        deleted: "Supprimé",
    };

    return (
        <Badge variant={variants[status] || "default"}>
            {labels[status]}
        </Badge>
    );
};

export default function DashboardPage() {
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
                                {mockStats.total}
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
                                {mockStats.validated}
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
                                {mockStats.draft}
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
                                {mockStats.deleted}
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
                        {recentSimulations.length === 0 ? (
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
                                        {recentSimulations.map((sim) => (
                                            <TableRow key={sim.id}>
                                                <TableCell>
                                                    {new Date(
                                                        sim.date
                                                    ).toLocaleDateString("fr-FR")}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {sim.montant.toLocaleString()}{" "}
                                                    €
                                                </TableCell>
                                                <TableCell>
                                                    {sim.taux}%
                                                </TableCell>
                                                <TableCell>
                                                    {sim.duree} mois
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(sim.status)}
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

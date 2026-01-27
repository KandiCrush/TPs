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
import { Eye, Copy, Trash2, Search, Filter } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { useState } from "react";

type SimulationStatus = "validated" | "draft" | "deleted";

interface Simulation {
    id: string;
    date: string;
    montant: number;
    taux: number;
    duree: number;
    status: SimulationStatus;
    mensualite?: number;
}

// Mock data
const mockSimulations: Simulation[] = [
    {
        id: "1",
        date: "2026-01-26",
        montant: 150000,
        taux: 3.2,
        duree: 240,
        status: "validated",
        mensualite: 850.50,
    },
    {
        id: "2",
        date: "2026-01-25",
        montant: 80000,
        taux: 3.8,
        duree: 180,
        status: "draft",
        mensualite: 580.25,
    },
    {
        id: "3",
        date: "2026-01-24",
        montant: 250000,
        taux: 2.9,
        duree: 300,
        status: "validated",
        mensualite: 1200.75,
    },
    {
        id: "4",
        date: "2026-01-23",
        montant: 120000,
        taux: 3.5,
        duree: 240,
        status: "validated",
        mensualite: 720.30,
    },
    {
        id: "5",
        date: "2026-01-22",
        montant: 200000,
        taux: 3.0,
        duree: 300,
        status: "draft",
        mensualite: 950.00,
    },
    {
        id: "6",
        date: "2026-01-20",
        montant: 100000,
        taux: 3.5,
        duree: 240,
        status: "validated",
        mensualite: 600.15,
    },
    {
        id: "7",
        date: "2026-01-18",
        montant: 50000,
        taux: 4.2,
        duree: 120,
        status: "draft",
        mensualite: 510.50,
    },
    {
        id: "8",
        date: "2026-01-15",
        montant: 200000,
        taux: 2.8,
        duree: 300,
        status: "validated",
        mensualite: 950.25,
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

export default function HistoriquePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<SimulationStatus | "all">("all");

    const filteredSimulations = mockSimulations.filter((sim) => {
        const matchesSearch =
            sim.montant.toString().includes(searchTerm) ||
            sim.taux.toString().includes(searchTerm) ||
            sim.duree.toString().includes(searchTerm);
        const matchesFilter =
            filterStatus === "all" || sim.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleView = (id: string) => {
        console.log("Voir simulation", id);
    };

    const handleDuplicate = (id: string) => {
        console.log("Dupliquer simulation", id);
    };

    const handleDelete = (id: string) => {
        console.log("Supprimer simulation", id);
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
                <h1 className="text-2xl font-bold">Historique des simulations</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Consultez et gérez toutes vos simulations de prêt
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                {/* Filters */}
                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle className="text-lg">Filtres</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Rechercher par montant, taux ou durée..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant={
                                        filterStatus === "all"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setFilterStatus("all")}
                                >
                                    Tous
                                </Button>
                                <Button
                                    variant={
                                        filterStatus === "validated"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setFilterStatus("validated")}
                                >
                                    Validés
                                </Button>
                                <Button
                                    variant={
                                        filterStatus === "draft"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setFilterStatus("draft")}
                                >
                                    Brouillons
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Simulations Table */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle>
                                Simulations ({filteredSimulations.length})
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {filteredSimulations.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <p className="text-lg font-medium mb-2">
                                    Aucune simulation trouvée
                                </p>
                                <p className="text-sm">
                                    Essayez de modifier vos critères de recherche
                                </p>
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
                                            <TableHead>Mensualité</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSimulations.map((sim) => (
                                            <TableRow key={sim.id}>
                                                <TableCell>
                                                    {new Date(
                                                        sim.date
                                                    ).toLocaleDateString("fr-FR", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                    })}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {sim.montant.toLocaleString()}{" "}
                                                    €
                                                </TableCell>
                                                <TableCell>
                                                    {sim.taux}%
                                                </TableCell>
                                                <TableCell>
                                                    {sim.duree} mois (
                                                    {(sim.duree / 12).toFixed(1)}{" "}
                                                    ans)
                                                </TableCell>
                                                <TableCell>
                                                    {sim.mensualite
                                                        ? `${sim.mensualite.toFixed(2)} €`
                                                        : "-"}
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
                                                            onClick={() =>
                                                                handleView(sim.id)
                                                            }
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            title="Dupliquer"
                                                            onClick={() =>
                                                                handleDuplicate(
                                                                    sim.id
                                                                )
                                                            }
                                                        >
                                                            <Copy className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            title="Supprimer"
                                                            onClick={() =>
                                                                handleDelete(sim.id)
                                                            }
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

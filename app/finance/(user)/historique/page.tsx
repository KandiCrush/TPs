"use client";

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
import { Eye, Copy, Trash2, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";
import { SimulationResultType } from "@/src/lib/z-type";
import { DeleteSimButton } from "../_components/delete-sim-button";
import { handleDeleted, handleValidated } from "@/src/lib/action";
import { ValidateSimButton } from "../_components/valide-sim-button";
import { SimulationDetailsModal } from "@/src/components/SimulationDetailsModal";

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

export default function HistoriquePage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterStatus, setFilterStatus] = useState<SimulationStatus | "all">(
        "all"
    );
    const [simulations, setSimulations] = useState<SimulationResultType[]>([]);

    useEffect(() => {
        const fetchSimulations = async () => {
            const response = await fetch("/api/simulation");
            const data = await response.json();
            setSimulations(data.simulations);
        };

        fetchSimulations();
    }, []);

    const filteredSimulations = simulations.filter((sim) => {
        const matchesSearch =
            sim.montant.toString().includes(searchTerm) ||
            sim.simulation!.taux.toString().includes(searchTerm) ||
            sim.duree.toString().includes(searchTerm);
        const matchesFilter =
            filterStatus === "all" || sim.statut === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
                <h1 className="text-2xl font-bold">
                    Historique des simulations
                </h1>
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
                                        filterStatus === "VALIDATED"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setFilterStatus("VALIDATED")}
                                >
                                    Validés
                                </Button>
                                <Button
                                    variant={
                                        filterStatus === "DRAFT"
                                            ? "default"
                                            : "outline"
                                    }
                                    size="sm"
                                    onClick={() => setFilterStatus("DRAFT")}
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
                                    Essayez de modifier vos critères de
                                    recherche
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
                                                        sim.simulation!.dateTraitement
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                        {
                                                            year: "numeric",
                                                            month: "long",
                                                            day: "numeric",
                                                        }
                                                    )}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {sim.montant.toLocaleString()}{" "}
                                                    €
                                                </TableCell>
                                                <TableCell>
                                                    {sim.simulation!.taux}%
                                                </TableCell>
                                                <TableCell>
                                                    {sim.duree} mois (
                                                    {(sim.duree / 12).toFixed(
                                                        1
                                                    )}{" "}
                                                    ans)
                                                </TableCell>
                                                <TableCell>
                                                    {sim.mensualite
                                                        ? `${sim.mensualite.toFixed(
                                                              2
                                                          )} $`
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(sim.statut)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <SimulationDetailsModal
                                                            simulation={sim}
                                                        />
                                                        {sim.statut !==
                                                            "VALIDATED" && (
                                                            <ValidateSimButton
                                                                id={sim.id!}
                                                                validateFunction={
                                                                    handleValidated
                                                                }
                                                            />
                                                        )}

                                                        <DeleteSimButton
                                                            id={sim.id!}
                                                            deleteFunction={
                                                                handleDeleted
                                                            }
                                                        />
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

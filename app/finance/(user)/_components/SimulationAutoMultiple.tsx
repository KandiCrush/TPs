"use client";

import * as React from "react";
import { useState, useCallback } from "react";
import { CalculAmortissement } from "@/src/lib/amortissement";
import type { Props, AmortissementRow } from "@/src/lib/amortissement";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import { Loader2, Eye, Save } from "lucide-react";
import { toast } from "sonner";
import { GeneratedSimulationDetailsModal } from "./GeneratedSimulationDetailsModal";
import type { GeneratedSimulationData } from "./GeneratedSimulationDetailsModal";

// ---------------------------------------------------------------------------
// Clients mockés (pas de DB)
// ---------------------------------------------------------------------------

const MOCK_CLIENTS: {
    id: string;
    nom: string;
    prenom: string;
    email?: string;
}[] = [
    {
        id: "mock-1",
        nom: "Dupont",
        prenom: "Marie",
        email: "marie.dupont@exemple.fr",
    },
    {
        id: "mock-2",
        nom: "Martin",
        prenom: "Pierre",
        email: "p.martin@exemple.fr",
    },
    { id: "mock-3", nom: "Bernard", prenom: "Sophie" },
    {
        id: "mock-4",
        nom: "Petit",
        prenom: "Jean",
        email: "jean.petit@exemple.fr",
    },
    { id: "mock-5", nom: "Durand", prenom: "Isabelle" },
];

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]!;
}

function randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ---------------------------------------------------------------------------
// Type d'une simulation générée
// ---------------------------------------------------------------------------

export type GeneratedSimulationItem = {
    id: string;
    client: { nom: string; prenom: string; email?: string };
    typeTaux: "ANNUEL" | "MENSUEL";
    inputs: Props;
    output: AmortissementRow[];
    computationTimeMs: number;
};

function formatEuro(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function SimulationAutoMultiple() {
    const [typeTaux, setTypeTaux] = useState<"ANNUEL" | "MENSUEL">("ANNUEL");
    const [taux, setTaux] = useState("");
    const [count, setCount] = useState("5");
    const [isRunning, setIsRunning] = useState(false);
    const [results, setResults] = useState<GeneratedSimulationItem[]>([]);
    const [totalTimeMs, setTotalTimeMs] = useState<number | null>(null);
    const [detailsModal, setDetailsModal] = useState<{
        open: boolean;
        data: GeneratedSimulationData | null;
    }>({ open: false, data: null });
    const [savingId, setSavingId] = useState<string | null>(null);

    const runSimulations = useCallback(async () => {
        const n = Math.min(Math.max(1, parseInt(count, 10) || 1), 50);
        const tauxNum = parseFloat(taux.replace(",", "."));
        if (Number.isNaN(tauxNum) || tauxNum <= 0) return;

        setIsRunning(true);
        setResults([]);
        setTotalTimeMs(null);

        const tauxMensuelDecimal =
            typeTaux === "ANNUEL" ? tauxNum / 100 / 12 : tauxNum / 100;

        const items: GeneratedSimulationItem[] = [];
        const startTotal = performance.now();

        for (let i = 0; i < n; i++) {
            const client = pickRandom(MOCK_CLIENTS);
            const montant = randomInRange(50_000, 350_000);
            const duree = randomInRange(12, 360);

            const start = performance.now();
            const result = CalculAmortissement({
                montant,
                taux: tauxMensuelDecimal,
                duree,
                date: new Date(),
                mensualite: null,
                assuranceRate: null,
            });
            const elapsed = performance.now() - start;

            if (
                result.error ||
                !result.data.inputs ||
                Array.isArray(result.data.inputs)
            )
                continue;

            items.push({
                id: `gen-${Date.now()}-${i}`,
                client: {
                    nom: client.nom,
                    prenom: client.prenom,
                    email: client.email,
                },
                typeTaux,
                inputs: result.data.inputs,
                output: result.data.output,
                computationTimeMs: Math.round(elapsed * 100) / 100,
            });
        }

        const totalElapsed = performance.now() - startTotal;
        setTotalTimeMs(Math.round(totalElapsed * 100) / 100);
        setResults(items);
        setIsRunning(false);
    }, [typeTaux, taux, count]);

    const openDetails = useCallback((item: GeneratedSimulationItem) => {
        setDetailsModal({
            open: true,
            data: {
                client: item.client,
                typeTaux: item.typeTaux,
                inputs: item.inputs,
                output: item.output,
            },
        });
    }, []);

    const closeDetails = useCallback(() => {
        setDetailsModal({ open: false, data: null });
    }, []);

    const handleSave = useCallback(async (item: GeneratedSimulationItem) => {
        setSavingId(item.id);
        try {
            const inputs = item.inputs;
            if (!inputs || Array.isArray(inputs)) {
                setSavingId(null);
                return;
            }
            const tauxPercent =
                item.typeTaux === "ANNUEL"
                    ? inputs.taux * 1200
                    : inputs.taux * 100;
            const totalInterets = item.output.reduce(
                (s, r) => s + r.interet,
                0
            );
            const totalAssurance = item.output.reduce(
                (s, r) => s + r.assurance,
                0
            );

            const res = await fetch("/api/simulation/single", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client: item.client,
                    simulation: {
                        taux: tauxPercent,
                        typeTaux: item.typeTaux,
                        dateTraitement: new Date().toISOString(),
                    },
                    detail: {
                        montant: inputs.montant ?? 0,
                        duree: inputs.duree ?? 0,
                        mensualite: inputs.mensualite ?? 0,
                        totalInterets,
                        totalAssurance:
                            totalAssurance > 0 ? totalAssurance : null,
                    },
                }),
            });

            const data = await res.json();
            if (data.error) {
                toast.error(data.message ?? "Erreur lors de l'enregistrement");
            } else {
                toast.success("Simulation enregistrée avec succès");
            }
        } finally {
            setSavingId(null);
        }
    }, []);

    const tauxDisplay =
        typeTaux === "ANNUEL"
            ? results[0]?.inputs && !Array.isArray(results[0].inputs)
                ? (results[0].inputs.taux * 12 * 100).toFixed(2)
                : taux || "—"
            : results[0]?.inputs && !Array.isArray(results[0].inputs)
            ? (results[0].inputs.taux * 100).toFixed(2)
            : taux || "—";

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Simulation automatique multiple</CardTitle>
                    <CardDescription>
                        Paramètres globaux : lancez N simulations avec un client
                        et des paramètres aléatoires. Aucune donnée n’est
                        enregistrée automatiquement.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="space-y-2">
                            <Label>Type de taux</Label>
                            <Select
                                value={typeTaux}
                                onValueChange={(v) =>
                                    setTypeTaux(v as "ANNUEL" | "MENSUEL")
                                }
                                disabled={isRunning}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ANNUEL">
                                        ANNUEL
                                    </SelectItem>
                                    <SelectItem value="MENSUEL">
                                        MENSUEL
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>
                                Taux (%{" "}
                                {typeTaux === "ANNUEL" ? "annuel" : "mensuel"})
                            </Label>
                            <Input
                                type="text"
                                inputMode="decimal"
                                placeholder={
                                    typeTaux === "ANNUEL" ? "3.5" : "0.29"
                                }
                                value={taux}
                                onChange={(e) => setTaux(e.target.value)}
                                disabled={isRunning}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Nombre de simulations</Label>
                            <Input
                                type="number"
                                min={1}
                                max={50}
                                value={count}
                                onChange={(e) => setCount(e.target.value)}
                                disabled={isRunning}
                            />
                        </div>
                        <div className="flex items-end">
                            <Button
                                onClick={runSimulations}
                                disabled={isRunning}
                                className="w-full sm:w-auto"
                            >
                                {isRunning ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Génération…
                                    </>
                                ) : (
                                    "Lancer les simulations"
                                )}
                            </Button>
                        </div>
                    </div>

                    {totalTimeMs != null && results.length > 0 && (
                        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                            <span>
                                Temps total :{" "}
                                <strong className="text-foreground">
                                    {totalTimeMs.toFixed(2)} ms
                                </strong>
                            </span>
                            <span>
                                Temps moyen :{" "}
                                <strong className="text-foreground">
                                    {(totalTimeMs / results.length).toFixed(2)}{" "}
                                    ms
                                </strong>
                            </span>
                        </div>
                    )}

                    {results.length > 0 && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Client</TableHead>
                                        <TableHead className="text-right">
                                            Montant
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Durée
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Taux
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Mensualité
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Total intérêts
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Temps (ms)
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results.map((item) => {
                                        const inp = item.inputs;
                                        const validInputs =
                                            inp && !Array.isArray(inp);
                                        const totalInterets =
                                            item.output.reduce(
                                                (s, r) => s + r.interet,
                                                0
                                            );
                                        return (
                                            <TableRow key={item.id}>
                                                <TableCell className="font-medium">
                                                    {item.client.prenom}{" "}
                                                    {item.client.nom}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {validInputs &&
                                                    inp.montant != null
                                                        ? formatEuro(
                                                              inp.montant
                                                          )
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {validInputs &&
                                                    inp.duree != null
                                                        ? `${inp.duree} mois`
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {tauxDisplay} %
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {validInputs &&
                                                    inp.mensualite != null
                                                        ? formatEuro(
                                                              inp.mensualite
                                                          )
                                                        : "—"}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {formatEuro(totalInterets)}
                                                </TableCell>
                                                <TableCell className="text-right tabular-nums">
                                                    {item.computationTimeMs.toFixed(
                                                        2
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() =>
                                                                openDetails(
                                                                    item
                                                                )
                                                            }
                                                            disabled={isRunning}
                                                            title="Voir détails"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            onClick={() =>
                                                                handleSave(item)
                                                            }
                                                            disabled={
                                                                isRunning ||
                                                                savingId ===
                                                                    item.id
                                                            }
                                                            title="Enregistrer"
                                                        >
                                                            {savingId ===
                                                            item.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <Save className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <GeneratedSimulationDetailsModal
                open={detailsModal.open}
                onClose={closeDetails}
                data={detailsModal.data}
            />
        </>
    );
}

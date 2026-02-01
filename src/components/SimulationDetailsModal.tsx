"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { SimulationResultType } from "@/src/lib/z-type";

// ---------------------------------------------------------------------------
// Utilitaire : formatage devise
// ---------------------------------------------------------------------------

export function formatDollar(value: number): string {
    return value.toFixed(2) + " $";
}

// ---------------------------------------------------------------------------
// Types internes
// ---------------------------------------------------------------------------

type AmortizationRow = {
    mois: number;
    capitalRestant: number;
    interet: number;
    amortissement: number;
    mensualite: number;
    assurance?: number;
    totalMensualite?: number;
};

type SimulationDetailsModalProps = {
    simulation: SimulationResultType;
    className?: string;
};

// ---------------------------------------------------------------------------
// Génération du tableau d’amortissement
// ---------------------------------------------------------------------------

function generateAmortizationTable(params: {
    montant: number;
    mensualite: number;
    duree: number;
    tauxMensuel: number;
    totalAssurance?: number | null;
}): AmortizationRow[] {
    const { montant, mensualite, duree, tauxMensuel, totalAssurance } = params;

    const assuranceMensuelle =
        totalAssurance && duree ? totalAssurance / duree : 0;

    let capitalRestant = montant;
    const rows: AmortizationRow[] = [];

    for (let mois = 1; mois <= duree; mois++) {
        const interet = capitalRestant * (tauxMensuel / 100);
        const amortissement = mensualite - interet;
        capitalRestant = Math.max(capitalRestant - amortissement, 0);

        rows.push({
            mois,
            capitalRestant,
            interet,
            amortissement,
            mensualite,
            assurance: assuranceMensuelle / 100 || undefined,
            totalMensualite: assuranceMensuelle
                ? mensualite + assuranceMensuelle
                : undefined,
        });
    }

    return rows;
}

// ---------------------------------------------------------------------------
// Sous-composants
// ---------------------------------------------------------------------------

function SummaryCard({ simulation }: { simulation: SimulationResultType }) {
    const session = simulation.simulation;
    if (!session) return null;

    const tauxLabel =
        session.typeTaux === "ANNUEL"
            ? `${session.taux.toFixed(2)} % (annuel)`
            : `${session.taux.toFixed(2)} % (mensuel)`;

    const dateLabel = new Date(session.dateTraitement).toLocaleDateString(
        "fr-FR",
        {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }
    );

    return (
        <div className="rounded-xl border bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                Résumé
            </h3>
            <dl className="space-y-3">
                <div className="flex justify-between">
                    <dt>Montant</dt>
                    <dd className="font-medium">
                        {formatDollar(simulation.montant)}
                    </dd>
                </div>
                <div className="flex justify-between">
                    <dt>Taux</dt>
                    <dd>{tauxLabel}</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Durée</dt>
                    <dd>{simulation.duree} mois</dd>
                </div>
                <div className="flex justify-between">
                    <dt>Mensualité</dt>
                    <dd className="font-medium">
                        {formatDollar(simulation.mensualite)}
                    </dd>
                </div>
                <div className="flex justify-between">
                    <dt>Total intérêts</dt>
                    <dd>{formatDollar(simulation.totalInterets)}</dd>
                </div>
                {simulation.totalAssurance != null && (
                    <div className="flex justify-between">
                        <dt>Total assurance</dt>
                        <dd>{formatDollar(simulation.totalAssurance)}</dd>
                    </div>
                )}
                <div className="border-t pt-3 text-sm text-neutral-600">
                    Date de traitement : {dateLabel}
                </div>
            </dl>
        </div>
    );
}

function AmortizationTable({ rows }: { rows: AmortizationRow[] }) {
    const hasAssurance = rows.some((r) => r.assurance);
    const hasTotal = rows.some((r) => r.totalMensualite);

    return (
        <div className="rounded-xl border bg-white shadow-sm">
            <h3 className="border-b bg-neutral-50 px-4 py-3 text-sm font-semibold uppercase text-neutral-600">
                Tableau d’amortissement
            </h3>
            <div className="max-h-[70vh] overflow-auto">
                <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-neutral-100">
                        <tr>
                            <th className="px-3 py-2">Mois</th>
                            <th className="px-3 py-2 text-right">
                                Capital restant
                            </th>
                            <th className="px-3 py-2 text-right">Intérêt</th>
                            <th className="px-3 py-2 text-right">
                                Amortissement
                            </th>
                            <th className="px-3 py-2 text-right">Mensualité</th>
                            {hasAssurance && (
                                <th className="px-3 py-2 text-right">
                                    Assurance
                                </th>
                            )}
                            {hasTotal && (
                                <th className="px-3 py-2 text-right">Total</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.mois}
                                className="border-b hover:bg-neutral-50"
                            >
                                <td className="px-3 py-2 text-center">
                                    {row.mois}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    {formatDollar(row.capitalRestant)}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    {formatDollar(row.interet)}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    {formatDollar(row.amortissement)}
                                </td>
                                <td className="px-3 py-2 text-right">
                                    {formatDollar(row.mensualite)}
                                </td>
                                {hasAssurance && (
                                    <td className="px-3 py-2 text-right">
                                        {row.assurance
                                            ? formatDollar(row.assurance)
                                            : "—"}
                                    </td>
                                )}
                                {hasTotal && (
                                    <td className="px-3 py-2 text-right">
                                        {row.totalMensualite
                                            ? formatDollar(row.totalMensualite)
                                            : "—"}
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// Composant principal
// ---------------------------------------------------------------------------

export function SimulationDetailsModal({
    simulation,
    className,
}: SimulationDetailsModalProps) {
    const session = simulation.simulation;
    if (!session) return null;

    const tauxMensuel =
        session.typeTaux === "ANNUEL" ? session.taux / 12 : session.taux;

    const rows = React.useMemo(
        () =>
            generateAmortizationTable({
                montant: simulation.montant,
                mensualite: simulation.mensualite,
                duree: simulation.duree,
                tauxMensuel,
                totalAssurance: simulation.totalAssurance,
            }),
        [simulation, tauxMensuel]
    );

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Eye className="h-4 w-4" />
                </Button>
            </DialogTrigger>

            <DialogContent
                className={cn(
                    "flex max-h-[90vh] max-w-6xl flex-col overflow-hidden p-0",
                    className
                )}
            >
                <DialogHeader className="border-b px-5 py-4">
                    <DialogTitle>Détails de la simulation</DialogTitle>
                </DialogHeader>

                <div className="flex-1 overflow-auto p-5 pt-0">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        <div className="lg:w-[35%] flex flex-col gap-5">
                            <SummaryCard simulation={simulation} />
                        </div>
                        <div className="lg:w-[65%]">
                            <AmortizationTable rows={rows} />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

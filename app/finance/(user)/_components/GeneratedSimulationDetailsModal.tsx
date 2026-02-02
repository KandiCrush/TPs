"use client";

import * as React from "react";
import { cn } from "@/src/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/src/components/ui/dialog";
import type { Props, AmortissementRow } from "@/src/lib/amortissement";

function formatEuro(value: number): string {
    return new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export type GeneratedSimulationData = {
    client: { nom: string; prenom: string; email?: string };
    typeTaux: "ANNUEL" | "MENSUEL";
    inputs: Props;
    output: AmortissementRow[];
};

type GeneratedSimulationDetailsModalProps = {
    open: boolean;
    onClose: () => void;
    data: GeneratedSimulationData | null;
};

function ClientCard({ client }: { client: GeneratedSimulationData["client"] }) {
    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                Client
            </h3>
            <dl className="space-y-2">
                <div>
                    <dt className="sr-only">Nom et prénom</dt>
                    <dd className="text-base font-medium text-neutral-900">
                        {client.prenom} {client.nom}
                    </dd>
                </div>
                {client.email && (
                    <div>
                        <dt className="text-xs text-neutral-500">Email</dt>
                        <dd className="text-sm text-neutral-700">
                            {client.email}
                        </dd>
                    </div>
                )}
            </dl>
        </div>
    );
}

function SummaryCard({
    inputs,
    typeTaux,
    totalInterets,
}: {
    inputs: Props;
    typeTaux: "ANNUEL" | "MENSUEL";
    totalInterets: number;
}) {
    if (!inputs || Array.isArray(inputs)) return null;
    const { montant, taux, duree, mensualite, assuranceRate } = inputs;
    const tauxLabel =
        typeTaux === "ANNUEL"
            ? `${(taux * 12 * 100).toFixed(2)} % (annuel)`
            : `${(taux * 100).toFixed(2)} % (mensuel)`;

    return (
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                Résumé de la simulation
            </h3>
            <dl className="space-y-3">
                {montant != null && (
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-neutral-600">Montant</dt>
                        <dd className="text-right font-medium tabular-nums text-neutral-900">
                            {formatEuro(montant)}
                        </dd>
                    </div>
                )}
                <div className="flex justify-between gap-4">
                    <dt className="text-sm text-neutral-600">Taux</dt>
                    <dd className="text-right tabular-nums text-neutral-900">
                        {tauxLabel}
                    </dd>
                </div>
                {duree != null && (
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-neutral-600">
                            Durée (mois)
                        </dt>
                        <dd className="text-right tabular-nums text-neutral-900">
                            {duree}
                        </dd>
                    </div>
                )}
                {mensualite != null && (
                    <div className="flex justify-between gap-4">
                        <dt className="text-sm text-neutral-600">Mensualité</dt>
                        <dd className="text-right font-medium tabular-nums text-neutral-900">
                            {formatEuro(mensualite)}
                        </dd>
                    </div>
                )}
                <div className="flex justify-between gap-4">
                    <dt className="text-sm text-neutral-600">Total intérêts</dt>
                    <dd className="text-right tabular-nums text-neutral-900">
                        {formatEuro(totalInterets)}
                    </dd>
                </div>
                {assuranceRate != null &&
                    assuranceRate > 0 &&
                    montant != null && (
                        <div className="flex justify-between gap-4">
                            <dt className="text-sm text-neutral-600">
                                Taux assurance
                            </dt>
                            <dd className="text-right tabular-nums text-neutral-900">
                                {assuranceRate} %
                            </dd>
                        </div>
                    )}
            </dl>
        </div>
    );
}

function AmortizationTable({ rows }: { rows: AmortissementRow[] }) {
    const hasAssurance = rows.some((r) => r.assurance > 0);
    return (
        <div className="rounded-xl border border-neutral-200 bg-white shadow-sm">
            <h3 className="border-b border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold uppercase tracking-wide text-neutral-600">
                Tableau d&apos;amortissement
            </h3>
            <div className="max-h-[min(70vh,28rem)] overflow-auto">
                <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 z-10 bg-neutral-100">
                        <tr className="border-b border-neutral-200">
                            <th className="px-3 py-2.5 text-center font-semibold text-neutral-700">
                                Mois
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold text-neutral-700">
                                Capital restant
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold text-neutral-700">
                                Intérêt
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold text-neutral-700">
                                Amortiss.
                            </th>
                            <th className="px-3 py-2.5 text-right font-semibold text-neutral-700">
                                Mensualité
                            </th>
                            {hasAssurance && (
                                <th className="px-3 py-2.5 text-right font-semibold text-neutral-700">
                                    Assurance
                                </th>
                            )}
                            <th className="px-3 py-2.5 text-right font-semibold text-neutral-700">
                                Total
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((row) => (
                            <tr
                                key={row.mois}
                                className="border-b border-neutral-100 hover:bg-neutral-50/80"
                            >
                                <td className="px-3 py-2 text-center tabular-nums text-neutral-800">
                                    {row.mois}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-neutral-800">
                                    {formatEuro(row.capitalRestant)}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-neutral-800">
                                    {formatEuro(row.interet)}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-neutral-800">
                                    {formatEuro(row.amortissement)}
                                </td>
                                <td className="px-3 py-2 text-right tabular-nums text-neutral-800">
                                    {formatEuro(row.mensualite)}
                                </td>
                                {hasAssurance && (
                                    <td className="px-3 py-2 text-right tabular-nums text-neutral-800">
                                        {formatEuro(row.assurance)}
                                    </td>
                                )}
                                <td className="px-3 py-2 text-right tabular-nums text-neutral-800">
                                    {formatEuro(row.totalMensualite)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export function GeneratedSimulationDetailsModal({
    open,
    onClose,
    data,
}: GeneratedSimulationDetailsModalProps) {
    if (!data) return null;

    const totalInterets = data.output.reduce((s, r) => s + r.interet, 0);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
            <DialogContent
                className={cn(
                    "flex max-h-[90vh] max-w-6xl flex-col gap-0 overflow-hidden p-0"
                )}
            >
                <DialogHeader className="shrink-0 border-b border-border bg-background px-5 py-4 pr-12 text-left">
                    <DialogTitle>Détails de la simulation</DialogTitle>
                </DialogHeader>

                <div className="min-h-0 flex-1 overflow-auto p-5">
                    <div className="flex flex-col gap-5 lg:flex-row lg:gap-6">
                        <div className="min-w-0 lg:w-[65%]">
                            <AmortizationTable rows={data.output} />
                        </div>
                        <div className="flex shrink-0 flex-col gap-5 lg:w-[35%]">
                            <ClientCard client={data.client} />
                            <SummaryCard
                                inputs={data.inputs}
                                typeTaux={data.typeTaux}
                                totalInterets={totalInterets}
                            />
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

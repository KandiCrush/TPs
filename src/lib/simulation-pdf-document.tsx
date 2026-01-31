"use client";

import React from "react";
import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import type {
    SimulationPDFData,
    SimulationPDFTableauRow,
} from "./simulation-pdf-types";

/**
 * Formate un nombre en montant dollars (style français).
 */
function formatDollar(value: number): string {
    return value.toFixed(2) + " $";
}

function formatDate(date: Date): string {
    return new Intl.DateTimeFormat("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
    }).format(date);
}

const ROWS_PER_PAGE = 28;

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: "Helvetica",
        fontSize: 10,
    },
    header: {
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 4,
    },
    headerDate: {
        fontSize: 9,
        color: "#555",
        marginBottom: 8,
    },
    separator: {
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        marginBottom: 8,
    },
    block: {
        marginBottom: 16,
    },
    row: {
        flexDirection: "row",
        marginBottom: 4,
    },
    label: {
        width: 140,
        color: "#444",
    },
    value: {
        flex: 1,
        textAlign: "right",
    },
    tableWrapper: {
        marginTop: 8,
        marginBottom: 16,
    },
    tableHeader: {
        flexDirection: "row",
        backgroundColor: "#f0f0f0",
        borderBottomWidth: 1,
        borderBottomColor: "#333",
        paddingVertical: 6,
        paddingHorizontal: 6,
        fontWeight: "bold",
        fontSize: 9,
    },
    tableRow: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
        paddingVertical: 4,
        paddingHorizontal: 6,
        fontSize: 9,
    },
    colMois: { width: 36, textAlign: "center" },
    colMontant: { width: 72, textAlign: "right" },
    colMontantNarrow: { width: 58, textAlign: "right" },
    footer: {
        position: "absolute",
        bottom: 24,
        left: 40,
        right: 40,
        flexDirection: "row",
        justifyContent: "space-between",
        fontSize: 8,
        color: "#666",
    },
});

/**
 * En-tête du tableau (ligne de titres).
 */
function TableHeader({
    hasAssurance,
    hasTotalMensualite,
}: {
    hasAssurance: boolean;
    hasTotalMensualite: boolean;
}) {
    return (
        <View style={styles.tableHeader}>
            <Text style={styles.colMois}>Mois</Text>
            <Text style={styles.colMontant}>Capital restant</Text>
            <Text style={styles.colMontantNarrow}>Intérêt</Text>
            <Text style={styles.colMontantNarrow}>Amortiss.</Text>
            <Text style={styles.colMontantNarrow}>Mensualité</Text>
            {hasAssurance && (
                <Text style={styles.colMontantNarrow}>Assurance</Text>
            )}
            {hasTotalMensualite && (
                <Text style={styles.colMontantNarrow}>Total</Text>
            )}
        </View>
    );
}

/**
 * Une ligne du tableau d'amortissement.
 */
function TableRow({
    row,
    hasAssurance,
    hasTotalMensualite,
}: {
    row: SimulationPDFTableauRow;
    hasAssurance: boolean;
    hasTotalMensualite: boolean;
}) {
    return (
        <View style={styles.tableRow}>
            <Text style={styles.colMois}>{row.mois}</Text>
            <Text style={styles.colMontant}>
                {formatDollar(row.capitalRestant)}
            </Text>
            <Text style={styles.colMontantNarrow}>
                {formatDollar(row.interet)}
            </Text>
            <Text style={styles.colMontantNarrow}>
                {formatDollar(row.amortissement)}
            </Text>
            <Text style={styles.colMontantNarrow}>
                {formatDollar(row.mensualite)}
            </Text>
            {hasAssurance && (
                <Text style={styles.colMontantNarrow}>
                    {row.assurance != null ? formatDollar(row.assurance) : "—"}
                </Text>
            )}
            {hasTotalMensualite && (
                <Text style={styles.colMontantNarrow}>
                    {row.totalMensualite != null
                        ? formatDollar(row.totalMensualite)
                        : "—"}
                </Text>
            )}
        </View>
    );
}

/**
 * Première page : en-tête, client, résumé, début du tableau.
 */
function FirstPageContent({
    data,
    firstRows,
    hasAssurance,
    hasTotalMensualite,
}: {
    data: SimulationPDFData;
    firstRows: SimulationPDFTableauRow[];
    hasAssurance: boolean;
    hasTotalMensualite: boolean;
}) {
    const { client, simulation } = data;
    const tauxLabel =
        simulation.typeTaux === "ANNUEL"
            ? `${simulation.taux.toFixed(2)} % (annuel)`
            : `${simulation.taux.toFixed(2)} % (mensuel)`;

    return (
        <>
            <View style={styles.header}>
                <Text style={styles.title}>Simulation de prêt</Text>
                <Text style={styles.headerDate}>
                    Date de génération : {formatDate(new Date())}
                </Text>
                <View style={styles.separator} />
            </View>

            <View style={styles.block}>
                <Text style={styles.sectionTitle}>Client</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Nom et prénom</Text>
                    <Text style={styles.value}>
                        {client.prenom} {client.nom}
                    </Text>
                </View>
                {client.email && (
                    <View style={styles.row}>
                        <Text style={styles.label}>Email</Text>
                        <Text style={styles.value}>{client.email}</Text>
                    </View>
                )}
            </View>

            <View style={styles.block}>
                <Text style={styles.sectionTitle}>Résumé de la simulation</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Montant emprunté</Text>
                    <Text style={styles.value}>
                        {formatDollar(simulation.montant)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Taux</Text>
                    <Text style={styles.value}>{tauxLabel}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Durée (mois)</Text>
                    <Text style={styles.value}>{simulation.duree}</Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Mensualité</Text>
                    <Text style={styles.value}>
                        {formatDollar(simulation.mensualite)}
                    </Text>
                </View>
                <View style={styles.row}>
                    <Text style={styles.label}>Total des intérêts</Text>
                    <Text style={styles.value}>
                        {formatDollar(simulation.totalInterets)}
                    </Text>
                </View>
                {simulation.totalAssurance != null &&
                    simulation.totalAssurance > 0 && (
                        <View style={styles.row}>
                            <Text style={styles.label}>Total assurance</Text>
                            <Text style={styles.value}>
                                {formatDollar(simulation.totalAssurance)}
                            </Text>
                        </View>
                    )}
            </View>

            <View style={styles.block}>
                <Text style={styles.sectionTitle}>
                    Tableau d&apos;amortissement
                </Text>
                <View style={styles.tableWrapper}>
                    <TableHeader
                        hasAssurance={hasAssurance}
                        hasTotalMensualite={hasTotalMensualite}
                    />
                    {firstRows.map((row) => (
                        <TableRow
                            key={row.mois}
                            row={row}
                            hasAssurance={hasAssurance}
                            hasTotalMensualite={hasTotalMensualite}
                        />
                    ))}
                </View>
            </View>
        </>
    );
}

/**
 * Page suivante : uniquement la suite du tableau (avec en-tête de colonnes).
 */
function TablePageContent({
    rows,
    hasAssurance,
    hasTotalMensualite,
}: {
    rows: SimulationPDFTableauRow[];
    hasAssurance: boolean;
    hasTotalMensualite: boolean;
}) {
    return (
        <View style={styles.block}>
            <Text style={styles.sectionTitle}>
                Tableau d&apos;amortissement (suite)
            </Text>
            <View style={styles.tableWrapper}>
                <TableHeader
                    hasAssurance={hasAssurance}
                    hasTotalMensualite={hasTotalMensualite}
                />
                {rows.map((row) => (
                    <TableRow
                        key={row.mois}
                        row={row}
                        hasAssurance={hasAssurance}
                        hasTotalMensualite={hasTotalMensualite}
                    />
                ))}
            </View>
        </View>
    );
}

/**
 * Document PDF complet : simulation de prêt.
 */
export function SimulationPDFDocument({ data }: { data: SimulationPDFData }) {
    const { tableau } = data;
    const hasAssurance = tableau.some(
        (r) => r.assurance != null && r.assurance > 0,
    );
    const hasTotalMensualite = tableau.some(
        (r) => r.totalMensualite != null && r.totalMensualite > 0,
    );

    const chunks: SimulationPDFTableauRow[][] = [];
    for (let i = 0; i < tableau.length; i += ROWS_PER_PAGE) {
        chunks.push(tableau.slice(i, i + ROWS_PER_PAGE));
    }

    const firstChunk = chunks[0] ?? [];
    const restChunks = chunks.slice(1);

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <FirstPageContent
                    data={data}
                    firstRows={firstChunk}
                    hasAssurance={hasAssurance}
                    hasTotalMensualite={hasTotalMensualite}
                />
                <View style={styles.footer}>
                    <Text>Document généré automatiquement</Text>
                    <Text>Page 1 / {chunks.length}</Text>
                </View>
            </Page>

            {restChunks.map((rows, index) => (
                <Page key={index} size="A4" style={styles.page}>
                    <TablePageContent
                        rows={rows}
                        hasAssurance={hasAssurance}
                        hasTotalMensualite={hasTotalMensualite}
                    />
                    <View style={styles.footer}>
                        <Text>Document généré automatiquement</Text>
                        <Text>
                            Page {index + 2} / {chunks.length}
                        </Text>
                    </View>
                </Page>
            ))}
        </Document>
    );
}

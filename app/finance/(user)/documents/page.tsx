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
    FileDown,
    FileText,
    FileSpreadsheet,
    Download,
    Eye,
    Trash2,
    Search,
} from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { useState } from "react";

type DocumentType = "pdf" | "excel";
type DocumentStatus = "ready" | "generating" | "error";

interface Document {
    id: string;
    simulationId: string;
    name: string;
    type: DocumentType;
    status: DocumentStatus;
    createdAt: string;
    size?: string;
    montant?: number;
}

// Mock data
const mockDocuments: Document[] = [
    {
        id: "1",
        simulationId: "1",
        name: "Tableau_amortissement_150000_2026-01-26.pdf",
        type: "pdf",
        status: "ready",
        createdAt: "2026-01-26T10:30:00",
        size: "245 KB",
        montant: 150000,
    },
    {
        id: "2",
        simulationId: "1",
        name: "Tableau_amortissement_150000_2026-01-26.xlsx",
        type: "excel",
        status: "ready",
        createdAt: "2026-01-26T10:31:00",
        size: "128 KB",
        montant: 150000,
    },
    {
        id: "3",
        simulationId: "3",
        name: "Tableau_amortissement_250000_2026-01-24.pdf",
        type: "pdf",
        status: "ready",
        createdAt: "2026-01-24T14:20:00",
        size: "312 KB",
        montant: 250000,
    },
    {
        id: "4",
        simulationId: "4",
        name: "Tableau_amortissement_120000_2026-01-23.pdf",
        type: "pdf",
        status: "ready",
        createdAt: "2026-01-23T09:15:00",
        size: "198 KB",
        montant: 120000,
    },
    {
        id: "5",
        simulationId: "6",
        name: "Tableau_amortissement_100000_2026-01-20.xlsx",
        type: "excel",
        status: "generating",
        createdAt: "2026-01-20T16:45:00",
        montant: 100000,
    },
    {
        id: "6",
        simulationId: "8",
        name: "Tableau_amortissement_200000_2026-01-15.pdf",
        type: "pdf",
        status: "error",
        createdAt: "2026-01-15T11:00:00",
        montant: 200000,
    },
];

const getTypeIcon = (type: DocumentType) => {
    return type === "pdf" ? (
        <FileText className="h-5 w-5 text-red-600" />
    ) : (
        <FileSpreadsheet className="h-5 w-5 text-green-600" />
    );
};

const getStatusBadge = (status: DocumentStatus) => {
    const variants = {
        ready: "default",
        generating: "secondary",
        error: "destructive",
    } as const;

    const labels = {
        ready: "Prêt",
        generating: "Génération...",
        error: "Erreur",
    };

    return (
        <Badge variant={variants[status] || "default"}>
            {labels[status]}
        </Badge>
    );
};

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");

    const filteredDocuments = mockDocuments.filter((doc) =>
        doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.montant?.toString().includes(searchTerm)
    );

    const handleDownload = (id: string) => {
        console.log("Télécharger document", id);
    };

    const handleView = (id: string) => {
        console.log("Voir document", id);
    };

    const handleDelete = (id: string) => {
        console.log("Supprimer document", id);
    };

    const pdfCount = filteredDocuments.filter((d) => d.type === "pdf").length;
    const excelCount = filteredDocuments.filter(
        (d) => d.type === "excel"
    ).length;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
                <h1 className="text-2xl font-bold">Documents et exports</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gérez tous vos fichiers générés
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Stats */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total documents
                            </CardTitle>
                            <FileText className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {filteredDocuments.length}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Fichiers PDF
                            </CardTitle>
                            <FileText className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">
                                {pdfCount}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Fichiers Excel
                            </CardTitle>
                            <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">
                                {excelCount}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Rechercher</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Rechercher par nom de fichier ou montant..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Documents Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            Documents ({filteredDocuments.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {filteredDocuments.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p className="text-lg font-medium mb-2">
                                    Aucun document trouvé
                                </p>
                                <p className="text-sm">
                                    Les fichiers exportés apparaîtront ici
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Type</TableHead>
                                            <TableHead>Nom du fichier</TableHead>
                                            <TableHead>Simulation</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Taille</TableHead>
                                            <TableHead>Statut</TableHead>
                                            <TableHead className="text-right">
                                                Actions
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredDocuments.map((doc) => (
                                            <TableRow key={doc.id}>
                                                <TableCell>
                                                    {getTypeIcon(doc.type)}
                                                </TableCell>
                                                <TableCell className="font-medium">
                                                    {doc.name}
                                                </TableCell>
                                                <TableCell>
                                                    {doc.montant
                                                        ? `${doc.montant.toLocaleString()} €`
                                                        : "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {new Date(
                                                        doc.createdAt
                                                    ).toLocaleDateString("fr-FR", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}
                                                </TableCell>
                                                <TableCell>
                                                    {doc.size || "-"}
                                                </TableCell>
                                                <TableCell>
                                                    {getStatusBadge(doc.status)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        {doc.status ===
                                                            "ready" && (
                                                            <>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    title="Voir"
                                                                    onClick={() =>
                                                                        handleView(
                                                                            doc.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="h-8 w-8 p-0"
                                                                    title="Télécharger"
                                                                    onClick={() =>
                                                                        handleDownload(
                                                                            doc.id
                                                                        )
                                                                    }
                                                                >
                                                                    <Download className="h-4 w-4" />
                                                                </Button>
                                                            </>
                                                        )}
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            title="Supprimer"
                                                            onClick={() =>
                                                                handleDelete(doc.id)
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

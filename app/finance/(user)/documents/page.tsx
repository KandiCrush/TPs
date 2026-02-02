"use client";

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";
import { FileText, FileSpreadsheet, Download, Search } from "lucide-react";
import { Input } from "@/src/components/ui/input";
import { useEffect, useState } from "react";
import { SimulationDocumentType } from "@/src/lib/z-type";
import { simulationDocumentsSchema } from "@/src/lib/z-schema";
import { toast } from "sonner";

type DocumentType = "PDF" | "EXCEL";

const getTypeIcon = (type: DocumentType) => {
    return type === "PDF" ? (
        <FileText className="h-5 w-5 text-red-600" />
    ) : (
        <FileSpreadsheet className="h-5 w-5 text-green-600" />
    );
};

export default function DocumentsPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [documents, setDocuments] = useState<SimulationDocumentType[] | null>(
        null
    );

    useEffect(() => {
        const fetchDocuments = async () => {
            const response = await fetch("/api/document");
            const docs = await response.json();

            const validatedDocs = simulationDocumentsSchema.safeParse(
                docs.documents
            );

            if (!validatedDocs.success) {
                console.log(validatedDocs.error);

                toast.warning("Les données reçues sont incompatibles.");
                return;
            }

            setDocuments(validatedDocs.data!);
        };
        fetchDocuments();
    }, []);

    const filteredDocuments = documents
        ? documents.filter(
              (doc) =>
                  doc.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  doc.type?.toString().includes(searchTerm)
          )
        : [];

    const handleDownload = async (id: string, name: string) => {
        const response = await fetch("/api/document/download", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            console.error("Erreur téléchargement");
            return;
        }

        const blob = await response.blob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = name;
        a.click();

        URL.revokeObjectURL(url);
    };

    // const handleView = (id: string) => {
    //     console.log("Voir document", id);
    // };

    // const handleDelete = (id: string) => {
    //     console.log("Supprimer document", id);
    // };

    const pdfCount = filteredDocuments.filter((d) => d.type === "PDF").length;
    const excelCount = filteredDocuments.filter(
        (d) => d.type === "EXCEL"
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
                                            <TableHead>
                                                Nom du fichier
                                            </TableHead>

                                            <TableHead>Date</TableHead>
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
                                                    {doc.nom}
                                                </TableCell>

                                                <TableCell>
                                                    {new Date(
                                                        doc.createdAt!
                                                    ).toLocaleDateString(
                                                        "fr-FR",
                                                        {
                                                            year: "numeric",
                                                            month: "short",
                                                            day: "numeric",
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </TableCell>

                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0"
                                                            title="Télécharger"
                                                            onClick={() =>
                                                                handleDownload(
                                                                    doc.id!,
                                                                    doc.nom
                                                                )
                                                            }
                                                        >
                                                            <Download className="h-4 w-4" />
                                                        </Button>

                                                        {/* <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                                            title="Supprimer"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    doc.id
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button> */}
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

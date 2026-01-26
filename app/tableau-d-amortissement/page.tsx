"use client";

import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/src/components/ui/table";

import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    AmortissementRow,
    CalculAmortissement,
    Props,
} from "@/src/lib/amortissement";
import { useState } from "react";

export default function Page() {
    const [table, setTable] = useState<AmortissementRow[] | null>(null);
    const [param, setParam] = useState<Props | null>(null);

    const getFormData = async (form: HTMLFormElement) => {
        const formData = new FormData(form);

        const data = {
            montant: formData.get("montant"),
            taux: formData.get("taux"),
            duree: formData.get("duree"),
            mensualite: formData.get("mensualite"),
        };

        try {
            const result = await CalculAmortissement({
                montant: data.montant ? Number(data.montant) : null,
                taux: data.taux ? Number(data.taux) / 120 : 0,
                duree: data.duree ? Number(data.duree) : null,
                mensualite: data.mensualite ? Number(data.mensualite) : null,
            });
            await setTable(result.data.output);

            await setParam(result.data.inputs as Props);

            console.log(table);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <main className="h-screen bg-background p-10">
            <h1 className="mb-8 text-3xl font-bold">Tableau d’amortissement</h1>

            <div className="flex flex-col gap-8 lg:flex-row">
                {/* Formulaire */}
                <Card className="w-full lg:w-1/3">
                    <CardHeader>
                        <CardTitle>Données du prêt</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            className="space-y-4"
                            onSubmit={(e) => {
                                e.preventDefault();
                                getFormData(e.currentTarget);
                            }}
                        >
                            <div className="space-y-2">
                                <Label htmlFor="montant">
                                    Montant emprunté
                                </Label>
                                <Input
                                    name="montant"
                                    type="number"
                                    step={0.01}
                                    placeholder="Ex: 10 000"
                                    defaultValue={
                                        param?.montant?.toFixed(2) ?? ""
                                    }
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="taux">
                                    Taux d’intérêt annuel(%)
                                </Label>
                                <Input
                                    name="taux"
                                    type="number"
                                    step={0.01}
                                    placeholder="Ex: 12"
                                    required
                                    defaultValue={param ? param.taux * 120 : ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="duree">Durée (en mois)</Label>
                                <Input
                                    name="duree"
                                    type="number"
                                    step={0.01}
                                    placeholder="Ex: 24"
                                    defaultValue={param?.duree ?? ""}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mensualite">
                                    Mensualité (optionnel)
                                </Label>
                                <Input
                                    name="mensualite"
                                    type="number"
                                    step={0.01}
                                    placeholder="Laisser vide si inconnue"
                                    defaultValue={
                                        param?.mensualite?.toFixed(2) ?? ""
                                    }
                                />
                            </div>

                            <Button type="submit" className="w-full">
                                Générer le tableau
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Résultat */}
                <Card className="w-full lg:w-2/3">
                    <CardHeader>
                        <CardTitle>Résultat</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        {!table ? (
                            "Le tableau d’amortissement apparaîtra ici après le calcul."
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Mois</TableHead>
                                        <TableHead className="text-right">
                                            Intérêt
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Mensualité
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Amortissement
                                        </TableHead>
                                        <TableHead className="text-right">
                                            Capital restant dû
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {table.map((row) => (
                                        <TableRow key={row.mois}>
                                            <TableCell>{row.mois}</TableCell>

                                            <TableCell className="text-right">
                                                {row.interet.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {row.mensualite.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right ">
                                                {row.amortissement.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-right font-bold">
                                                {row.capitalRestant.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}

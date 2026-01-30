"use client";

import { Button } from "@/src/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
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
import { Switch } from "@/src/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { Separator } from "@/src/components/ui/separator";
import {
    AmortissementRow,
    CalculAmortissement,
    Props,
} from "@/src/lib/amortissement";
import { useState } from "react";
import {
    FileDown,
    FileSpreadsheet,
    RefreshCw,
    Save,
    Calculator,
} from "lucide-react";
import { ClientCombobox } from "@/src/components/ClientCombobox";
import { ClientType } from "@/src/lib/z-type";
import { toast } from "sonner";

type TauxType = "annuel" | "mensuel";

export default function SimulationPage() {
    const [table, setTable] = useState<AmortissementRow[] | null>(null);
    const [param, setParam] = useState<Props | null>(null);
    const [tauxType, setTauxType] = useState<TauxType>("annuel");
    const [insuranceEnabled, setInsuranceEnabled] = useState(false);
    const [insuranceRate, setInsuranceRate] = useState("");
    const [client, setClient] = useState<ClientType | null>(null);

    const getFormData = async (form: HTMLFormElement) => {
        const formData = new FormData(form);

        const data = {
            montant: formData.get("montant"),
            taux: formData.get("taux"),
            duree: formData.get("duree"),
            mensualite: formData.get("mensualite"),
        };

        try {
            let tauxMensuel = 0;
            if (data.taux) {
                const tauxValue = Number(data.taux);
                tauxMensuel =
                    tauxType === "annuel" ? tauxValue / 1200 : tauxValue / 100;
            }

            const result = await CalculAmortissement({
                montant: data.montant ? Number(data.montant) : null,
                taux: tauxMensuel,
                duree: data.duree ? Number(data.duree) : null,
                mensualite: data.mensualite ? Number(data.mensualite) : null,
                assuranceRate: Number(insuranceRate),
            });
            await setTable(result.data.output);
            await setParam(result.data.inputs as Props);
        } catch (error) {
            console.log(error);
            toast.message("Erreur lors de la génération du tableau");
        }
    };

    const handleReset = () => {
        setTable(null);
        setParam(null);
        setTauxType("annuel");
        setInsuranceEnabled(false);
        setInsuranceRate("");
    };

    const handleSaveSimulation = () => {
        if (!client) {
            toast.message("Veuillez sélectionner un client");
            return;
        }

        console.log("Simulation sauvegardée (UI only)");
    };

    const handleExportPDF = () => {
        if (!client) {
            toast.message("Veuillez sélectionner un client");
            return;
        }
        console.log("Export PDF (UI only)");
    };

    const handleExportExcel = () => {
        if (!client) {
            toast.message("Veuillez sélectionner un client");
            return;
        }
        console.log("Export Excel (UI only)");
    };

    const calculateInsuranceCost = () => {
        if (!insuranceEnabled || !insuranceRate || !param?.montant) return 0;
        const rate = Number(insuranceRate) / 100;
        return (param.montant * rate) / 12;
    };

    const totalInterest =
        table?.reduce((sum, row) => sum + row.interet, 0) || 0;
    const totalPayment =
        table?.reduce((sum, row) => sum + row.mensualite, 0) || 0;
    const insuranceMonthly = calculateInsuranceCost();
    const insuranceTotal =
        insuranceMonthly && param?.duree ? insuranceMonthly * param.duree : 0;

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="border-b bg-card px-6 py-4">
                <h1 className="text-2xl font-bold">Nouvelle simulation</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Créez un nouveau tableau d&apos;amortissement
                </p>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="flex flex-col gap-6 lg:flex-row">
                    {/* Left Column - Form */}
                    <div className="w-full lg:w-1/3 flex gap-6 flex-col">
                        {/* Simulation Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Paramètres du prêt</CardTitle>
                                <CardDescription>
                                    Remplissez les informations pour générer
                                    votre tableau d&apos;amortissement
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Client */}
                                <ClientCombobox
                                    value={client}
                                    onChange={setClient}
                                />
                                <Separator className="bg-red-500 my-6" />
                                <form
                                    className="space-y-6"
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        getFormData(e.currentTarget);
                                    }}
                                >
                                    {/* Type de taux */}
                                    <div className="space-y-3">
                                        <Label>
                                            Type de taux d&apos;intérêt
                                        </Label>
                                        <RadioGroup
                                            value={tauxType}
                                            onValueChange={(value) =>
                                                setTauxType(value as TauxType)
                                            }
                                            className="flex gap-6"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="annuel"
                                                    id="annuel"
                                                />
                                                <Label
                                                    htmlFor="annuel"
                                                    className="font-normal cursor-pointer"
                                                >
                                                    Taux annuel
                                                </Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem
                                                    value="mensuel"
                                                    id="mensuel"
                                                />
                                                <Label
                                                    htmlFor="mensuel"
                                                    className="font-normal cursor-pointer"
                                                >
                                                    Taux mensuel
                                                </Label>
                                            </div>
                                        </RadioGroup>
                                        <p className="text-sm text-muted-foreground">
                                            {tauxType === "annuel"
                                                ? "Le taux annuel sera converti automatiquement en taux mensuel pour le calcul"
                                                : "Le taux mensuel sera utilisé directement dans les calculs"}
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Montant */}
                                    <div className="space-y-2">
                                        <Label htmlFor="montant">
                                            Montant emprunté{" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="montant"
                                            name="montant"
                                            type="number"
                                            step={0.01}
                                            min={0}
                                            placeholder="Ex: 100 000"
                                            required
                                            defaultValue={
                                                param?.montant?.toFixed(2) ?? ""
                                            }
                                            disabled={!!table}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Montant total du prêt en euros
                                        </p>
                                    </div>

                                    {/* Taux */}
                                    <div className="space-y-2">
                                        <Label htmlFor="taux">
                                            Taux d&apos;intérêt (
                                            {tauxType === "annuel"
                                                ? "annuel"
                                                : "mensuel"}
                                            ){" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="taux"
                                            name="taux"
                                            type="number"
                                            step={0.01}
                                            min={0}
                                            max={
                                                tauxType === "annuel" ? 100 : 10
                                            }
                                            placeholder={
                                                tauxType === "annuel"
                                                    ? "Ex: 3.5"
                                                    : "Ex: 0.29"
                                            }
                                            required
                                            defaultValue={
                                                param
                                                    ? tauxType === "annuel"
                                                        ? param.taux * 120
                                                        : param.taux * 100
                                                    : ""
                                            }
                                            disabled={!!table}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            {tauxType === "annuel"
                                                ? "Taux annuel en pourcentage (ex: 3.5 pour 3.5%)"
                                                : "Taux mensuel en pourcentage (ex: 0.29 pour 0.29%)"}
                                        </p>
                                    </div>

                                    {/* Durée */}
                                    <div className="space-y-2">
                                        <Label htmlFor="duree">
                                            Durée (en mois){" "}
                                            <span className="text-destructive">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="duree"
                                            name="duree"
                                            type="number"
                                            step={1}
                                            min={1}
                                            placeholder="Ex: 240 (20 ans)"
                                            required
                                            defaultValue={param?.duree ?? ""}
                                            disabled={!!table}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Durée du prêt en nombre de mois
                                        </p>
                                    </div>

                                    {/* Mensualité */}
                                    <div className="space-y-2">
                                        <Label htmlFor="mensualite">
                                            Mensualité (optionnel)
                                        </Label>
                                        <Input
                                            id="mensualite"
                                            name="mensualite"
                                            type="number"
                                            step={0.01}
                                            min={0}
                                            placeholder="Laisser vide pour calcul automatique"
                                            defaultValue={
                                                param?.mensualite?.toFixed(2) ??
                                                ""
                                            }
                                            disabled={!!table}
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Si laissé vide, la mensualité sera
                                            calculée automatiquement
                                        </p>
                                    </div>

                                    <Separator />

                                    {/* Assurance */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="space-y-0.5">
                                                <Label htmlFor="insurance">
                                                    Assurance solde restant dû
                                                </Label>
                                                <p className="text-sm text-muted-foreground">
                                                    Protection optionnelle du
                                                    prêt
                                                </p>
                                            </div>
                                            <Switch
                                                id="insurance"
                                                checked={insuranceEnabled}
                                                onCheckedChange={
                                                    setInsuranceEnabled
                                                }
                                                disabled={!!table}
                                            />
                                        </div>

                                        {insuranceEnabled && (
                                            <div className="space-y-2 pl-6 border-l-2">
                                                <Label htmlFor="insuranceRate">
                                                    Taux d&apos;assurance (%)
                                                </Label>
                                                <Input
                                                    id="insuranceRate"
                                                    type="number"
                                                    step={0.01}
                                                    min={0}
                                                    max={5}
                                                    placeholder="Ex: 0.35"
                                                    value={insuranceRate}
                                                    onChange={(e) =>
                                                        setInsuranceRate(
                                                            e.target.value,
                                                        )
                                                    }
                                                    disabled={!!table}
                                                />
                                                {insuranceRate &&
                                                    param?.montant && (
                                                        <div className="p-3 bg-muted rounded-md">
                                                            <p className="text-sm font-medium">
                                                                Coût estimé par
                                                                mois:{" "}
                                                                <span className="text-primary">
                                                                    {insuranceMonthly.toFixed(
                                                                        2,
                                                                    )}{" "}
                                                                    $
                                                                </span>
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-3 pt-4">
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={!!table}
                                        >
                                            <Calculator className="mr-2 h-4 w-4" />
                                            Générer le tableau
                                        </Button>
                                        <section className="flex gap-3 flex-row">
                                            <Button
                                                className="flex-1"
                                                type="button"
                                                variant="outline"
                                                onClick={handleReset}
                                            >
                                                <RefreshCw className="mr-2 h-4 w-4" />
                                                Réinitialiser
                                            </Button>
                                            {table && (
                                                <Button
                                                    className="flex-1"
                                                    type="button"
                                                    variant="outline"
                                                    onClick={
                                                        handleSaveSimulation
                                                    }
                                                >
                                                    <Save className="mr-2 h-4 w-4" />
                                                    Sauvegarder
                                                </Button>
                                            )}
                                        </section>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Summary Card */}
                        {table && param && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Résumé</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Montant emprunté:
                                            </span>
                                            <span className="font-semibold">
                                                {param.montant?.toFixed(2)} $
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Taux ({tauxType}):
                                            </span>
                                            <span className="font-semibold">
                                                {tauxType === "annuel"
                                                    ? (
                                                          param.taux * 120
                                                      ).toFixed(2)
                                                    : (
                                                          param.taux * 100
                                                      ).toFixed(2)}{" "}
                                                %
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Durée:
                                            </span>
                                            <span className="font-semibold">
                                                {param.duree} mois (
                                                {(param.duree || 0) / 12} ans)
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Mensualité:
                                            </span>
                                            <span className="font-semibold text-primary">
                                                {param.mensualite?.toFixed(2)} $
                                            </span>
                                        </div>
                                        <Separator />
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Total intérêts:
                                            </span>
                                            <span className="font-semibold">
                                                {totalInterest.toFixed(2)} $
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                Total remboursé:
                                            </span>
                                            <span className="font-semibold">
                                                {totalPayment.toFixed(2)} $
                                            </span>
                                        </div>
                                        {insuranceEnabled &&
                                            insuranceMonthly > 0 && (
                                                <>
                                                    <Separator />
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Assurance/mois:
                                                        </span>
                                                        <span className="font-semibold">
                                                            {insuranceMonthly.toFixed(
                                                                2,
                                                            )}{" "}
                                                            $
                                                        </span>
                                                    </div>
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">
                                                            Total assurance:
                                                        </span>
                                                        <span className="font-semibold">
                                                            {insuranceTotal.toFixed(
                                                                2,
                                                            )}{" "}
                                                            $
                                                        </span>
                                                    </div>
                                                </>
                                            )}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Summary */}
                    <div className="flex-1 space-y-6">
                        {/* Results Table */}
                        {!table && (
                            <Card className="flex-1 h-full">
                                <CardHeader>
                                    <CardTitle>
                                        Tableau d&apos;amortissement
                                    </CardTitle>
                                    <CardDescription>
                                        Détail mensuel du remboursement du prêt
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex-1 flex items-center justify-center">
                                    <p className="text-center text-muted-foreground">
                                        Le tableau d&apos;amortissement sera
                                        affiché ici une fois l&apos;opération
                                        effectuée
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                        {table && (
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <CardTitle>
                                                Tableau d&apos;amortissement
                                            </CardTitle>
                                            <CardDescription>
                                                Détail mensuel du remboursement
                                                du prêt
                                            </CardDescription>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleExportPDF}
                                            >
                                                <FileDown className="mr-2 h-4 w-4" />
                                                PDF
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={handleExportExcel}
                                            >
                                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                                Excel
                                            </Button>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="rounded-md border">
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
                                                        Assurance
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
                                                        <TableCell>
                                                            {row.mois}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {row.interet.toFixed(
                                                                2,
                                                            )}{" "}
                                                            $
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {row.mensualite.toFixed(
                                                                2,
                                                            )}{" "}
                                                            $
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {row.assurance.toFixed(
                                                                2,
                                                            )}{" "}
                                                            $
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {row.amortissement.toFixed(
                                                                2,
                                                            )}{" "}
                                                            $
                                                        </TableCell>
                                                        <TableCell className="text-right font-semibold">
                                                            {row.capitalRestant.toFixed(
                                                                2,
                                                            )}{" "}
                                                            $
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

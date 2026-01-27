"use client";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";
import {
    Eye,
    EyeOff,
    Loader2,
    Lock,
    Mail,
    User,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // Simulation UI
        window.setTimeout(() => {
            router.push("/finance/finance");
            setIsLoading(false);
        }, 1200);
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-background">
            {/* Left side – branding */}
            <div className="hidden lg:flex flex-col justify-center px-16 bg-foreground border-r border-slate-800/60">
                <div className="max-w-md space-y-6">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/5 px-3 py-1 text-xs font-medium text-emerald-200">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Création de compte opérateur
                    </div>

                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-slate-50">
                            Simulation Crédit
                        </h1>
                        <p className="mt-3 text-slate-300/80 text-lg leading-relaxed">
                            Créez votre compte opérateur afin d’accéder à
                            l’outil interne de simulation et de gestion des
                            crédits clients.
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-4 text-sm text-slate-300/80">
                        Les comptes sont réservés au personnel autorisé.
                        Toute création est susceptible d’être auditée.
                    </div>
                </div>
            </div>
            
            {/* Right side – register form */}
            <div className="flex items-center justify-center px-4 py-10 lg:px-8">
                <Card className="w-full max-w-md shadow-sm transition-all duration-300 hover:border-emerald-500/60 hover:shadow-emerald-900/40">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl tracking-tight text-center">
                            Création de compte
                        </CardTitle>
                        <CardDescription>
                            Renseignez les informations nécessaires pour créer
                            votre compte opérateur.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                        <form className="space-y-5" onSubmit={handleSubmit}>
                            {/* Nom + Prénom */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Nom */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Nom</Label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Dupont"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Nom de famille tel qu’enregistré dans l’entreprise.
                                    </p>
                                </div>

                                {/* Prénom */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">Prénom</Label>
                                    <div className="relative">
                                        <User className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            placeholder="Jean"
                                            className="pl-10"
                                            required
                                        />
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Prénom utilisé pour l’identification interne.
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label className="text-xs font-medium">
                                    Email professionnel
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        type="email"
                                        placeholder="operateur@banque.com"
                                        className="pl-10"
                                        required
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Cet email servira d’identifiant de connexion.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                {/* Mot de passe */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">
                                        Mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            type={showPassword ? "text" : "password"}
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-1 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Minimum 8 caractères. Évite les informations personnelles.
                                    </p>
                                </div>

                                {/* Confirmation mot de passe */}
                                <div className="space-y-1.5">
                                    <Label className="text-xs font-medium">
                                        Confirmer le mot de passe
                                    </Label>
                                    <div className="relative">
                                        <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                        <Input
                                            type={showConfirmPassword ? "text" : "password"}
                                            className="pl-10 pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowConfirmPassword(!showConfirmPassword)
                                            }
                                            className="absolute right-1 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/60"
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-4 w-4" />
                                            ) : (
                                                <Eye className="h-4 w-4" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-slate-400">
                                        Saisis exactement le même mot de passe.
                                    </p>
                                </div>
                            </div>

                            {/* Actions */}
                            <Button
                                type="submit"
                                className="w-full gap-2 bg-emerald-600 hover:bg-emerald-500"
                                disabled={isLoading}
                            >
                                {isLoading && (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                )}
                                {isLoading
                                    ? "Création du compte..."
                                    : "Créer le compte"}
                            </Button>
                        </form>


                        <div className="text-center text-xs text-slate-500">
                            Un compte existe déjà ?{" "}
                            <span
                                className="cursor-pointer text-emerald-400 hover:underline"
                                onClick={() => router.push("/finance/auth/login")}
                            >
                                Se connecter
                            </span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

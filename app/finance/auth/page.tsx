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
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Soumission purement UI : aucun appel API ni logique d'authentification
    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);

        // Simulation d'un court délai réseau pour le feedback visuel
        window.setTimeout(() => {
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
                        Tableau de bord financier interne
                    </div>
                    <div>
                        <h1 className="text-4xl font-semibold tracking-tight text-slate-50">
                            Simulation Crédit
                        </h1>
                        <p className="mt-3 text-slate-300/80 text-lg leading-relaxed">
                            Accédez à votre espace opérateur pour créer, gérer
                            et analyser en toute confiance les simulations de
                            prêts clients.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-slate-300/80">
                        <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
                            <p className="font-medium text-slate-100">
                                Données sécurisées
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Accès chiffré et traçabilité des actions.
                            </p>
                        </div>
                        <div className="rounded-lg border border-slate-800/80 bg-slate-900/40 p-3">
                            <p className="font-medium text-slate-100">
                                Suivi en temps réel
                            </p>
                            <p className="text-xs text-slate-400 mt-1">
                                Visualisez l&apos;état des dossiers clients.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right side – login form */}
            <div className="flex items-center justify-center px-4 py-10 lg:px-8">
                <Card className="w-full max-w-md shadow-sm transition-all duration-300 hover:border-emerald-500/60 hover:shadow-emerald-900/40">
                    <CardHeader className="space-y-1 pb-4">
                        <CardTitle className="text-2xl tracking-tight text-center">
                            Identification
                        </CardTitle>
                        <CardDescription>
                            Entrez vos identifiants pour accéder à
                            l&apos;application de simulation crédit.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-2">
                        <form
                            className="space-y-5"
                            onSubmit={handleSubmit}
                            aria-describedby="login-helper"
                        >
                            {/* Email */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="email"
                                    className="text-xs font-medium"
                                >
                                    Email professionnel
                                </Label>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="operateur@banque.com"
                                        className="pl-10 placeholder:text-slate-500  transition-all duration-150"
                                        required
                                        autoComplete="email"
                                        inputMode="email"
                                    />
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Utilisez uniquement votre email interne
                                    d&apos;entreprise.
                                </p>
                            </div>

                            {/* Password */}
                            <div className="space-y-1.5">
                                <Label
                                    htmlFor="password"
                                    className="text-xs font-medium"
                                >
                                    Mot de passe
                                </Label>
                                <div className="relative">
                                    <Lock className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-slate-400" />
                                    <Input
                                        id="password"
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="••••••••"
                                        className="pl-10 pr-10 placeholder:text-slate-500  transition-all duration-150"
                                        required
                                        autoComplete="current-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className="absolute right-1 top-1.5 inline-flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-100 hover:bg-slate-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-0 transition-colors duration-150"
                                        aria-label={
                                            showPassword
                                                ? "Masquer le mot de passe"
                                                : "Afficher le mot de passe"
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-[11px] text-slate-400">
                                    Ne partagez jamais votre mot de passe.
                                    Assurez-vous d&apos;être sur un poste
                                    sécurisé.
                                </p>
                            </div>

                            {/* Actions */}
                            <div className="space-y-2 pt-1">
                                <Button
                                    type="submit"
                                    className="cursor-pointer w-full gap-2 bg-emerald-600 hover:bg-emerald-500 text-slate-50 transition-all duration-150 disabled:opacity-80 disabled:cursor-not-allowed disabled:hover:bg-emerald-600"
                                    disabled={isLoading}
                                    aria-busy={isLoading}
                                >
                                    {isLoading && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    {isLoading
                                        ? "Vérification des accès..."
                                        : "Se connecter"}
                                </Button>
                                <p
                                    id="login-helper"
                                    className="text-[11px] text-slate-400 text-center"
                                >
                                    En vous connectant, vous confirmez que
                                    l&apos;utilisation de cet outil respecte
                                    les politiques internes de sécurité.
                                </p>
                            </div>
                        </form>

                        <div className="text-center text-xs text-slate-500">
                            Accès réservé aux opérateurs autorisés. Les
                            tentatives d&apos;accès non autorisées peuvent être
                            consignées.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

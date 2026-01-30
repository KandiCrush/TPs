"use client";

import * as React from "react";
import { UserPlus } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/src/components/ui/card";
import { Separator } from "@/src/components/ui/separator";
import {
    Combobox,
    ComboboxInput,
    ComboboxContent,
    ComboboxList,
    ComboboxItem,
    ComboboxCollection,
    ComboboxEmpty,
} from "@/src/components/ui/combobox";
import { ClientType } from "../lib/z-type";
import { clientsSchema } from "../lib/z-schema";
import { toast } from "sonner";
import { Skeleton } from "./ui/skeleton";
import { createClientAction } from "@/app/actions";

function clientToLabel(client: ClientType): string {
    return `${client.prenom} ${client.nom}`.trim();
}
type CreateClientState = {
    error: boolean;
    message: string | "";
    data: {
        id: string;
        nom: string;
        prenom: string;
        email: string | null;
        telephone: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null;
};
const initialState: CreateClientState = {
    error: false,
    message: "",
    data: null,
};

export function ClientCombobox({
    value,
    onChange,
}: {
    value: ClientType | null;
    onChange: (client: ClientType | null) => void;
}) {
    const [clients, setClients] = React.useState<ClientType[]>([]);
    const [showCreateForm, setShowCreateForm] = React.useState(false);

    const [nom, setNom] = React.useState("");
    const [prenom, setPrenom] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [telephone, setTelephone] = React.useState("");
    const [errors, setErrors] = React.useState<{
        nom?: string;
        prenom?: string;
        message?: string;
    }>({});
    const [loadingClient, setLoadingClient] = React.useState(true);
    const [refreshCount, setRefreshCount] = React.useState(0);

    const [state, formAction, isPending] = React.useActionState(
        createClientAction,
        initialState,
    );

    // Récupération des clients
    React.useEffect(() => {
        const fetchData = async () => {
            setLoadingClient(true);

            try {
                const response = await fetch("/api/client/get");
                const result = await response.json();
                const validedClients = clientsSchema.safeParse(result.clients);

                if (!validedClients.success) {
                    setLoadingClient(false);
                    toast.message("Impossible de charger la liste des clients");

                    return;
                }

                setClients(validedClients.data || null);
            } catch (error) {
                setLoadingClient(false);
                console.log("Erreur lors du chargement des clients", error);

                toast.message(
                    "Une erreur est survenue lors du chargement des clients",
                );
            }
        };

        fetchData();
    }, [refreshCount]);

    // Création du client
    React.useEffect(() => {
        if (state.data) {
            setClients((prev) => [state.data, ...prev]);
            onChange(state.data);
            setShowCreateForm(false);
        }

        if (state?.error) {
            setErrors({ message: state.message });
            toast.message(state.message);
        }
    }, [state]);

    const handleCancelCreate = () => {
        setShowCreateForm(false);
        setNom("");
        setPrenom("");
        setEmail("");
        setTelephone("");
        setErrors({});
    };

    return (
        <div className="flex w-full max-w-md flex-col gap-4">
            {/* Sélection client */}
            <div className="space-y-2">
                <Label
                    htmlFor="client-combobox"
                    className="text-sm font-medium"
                >
                    Client
                </Label>
                {!clients ? (
                    loadingClient ? (
                        <Skeleton className="h-6 w-full" />
                    ) : (
                        <Button
                            type="button"
                            onClick={() => setRefreshCount(refreshCount + 1)}
                        >
                            Réessayer de charger la liste des clients
                        </Button>
                    )
                ) : (
                    <Combobox
                        items={clients}
                        value={value}
                        onValueChange={(v) => onChange(v as ClientType | null)}
                        itemToStringLabel={(item) =>
                            item ? clientToLabel(item as ClientType) : ""
                        }
                        isItemEqualToValue={(a, b) =>
                            (a as ClientType)?.id === (b as ClientType)?.id
                        }
                    >
                        <ComboboxInput
                            id="client-combobox"
                            placeholder="Rechercher par nom ou prénom..."
                            showClear={!!value}
                            className="w-full"
                            aria-label="Rechercher un client"
                        />
                        <ComboboxContent>
                            <ComboboxList>
                                <ComboboxCollection>
                                    {(item: ClientType) => (
                                        <ComboboxItem
                                            key={item.id}
                                            value={item}
                                        >
                                            <span className="font-medium">
                                                {item.prenom}
                                            </span>{" "}
                                            <span className="text-muted-foreground">
                                                {item.nom}
                                            </span>
                                        </ComboboxItem>
                                    )}
                                </ComboboxCollection>
                            </ComboboxList>
                            <ComboboxEmpty>Aucun client trouvé</ComboboxEmpty>
                        </ComboboxContent>
                    </Combobox>
                )}
                <p className="text-xs text-muted-foreground">
                    Sélectionnez un client existant ou ajoutez-en un nouveau
                    ci-dessous.
                </p>
            </div>

            {/* Client sélectionné */}
            {value && (
                <div
                    className="rounded-lg border bg-muted/50 px-3 py-2 text-sm transition-opacity duration-200"
                    role="status"
                    aria-live="polite"
                >
                    <span className="text-muted-foreground">
                        Client sélectionné :{" "}
                    </span>
                    <span className="font-medium">
                        {value.prenom} {value.nom} (
                        {value.telephone || "pas de numéro de téléphone"})
                    </span>
                    {value.email && (
                        <span className="block text-muted-foreground text-xs mt-0.5">
                            {value.email}
                        </span>
                    )}
                </div>
            )}

            <Separator className="my-1" />

            {/* Action création */}
            <div className="space-y-3">
                <Button
                    type="button"
                    variant="outline"
                    className="w-full gap-2 transition-colors duration-150"
                    onClick={() => setShowCreateForm((v) => !v)}
                    aria-expanded={showCreateForm}
                    aria-controls="create-client-form"
                    id="toggle-create-client"
                >
                    <UserPlus className="size-4" aria-hidden />
                    {showCreateForm
                        ? "Masquer le formulaire"
                        : "Ajouter un nouveau client"}
                </Button>

                {/* Formulaire création (collapsible) */}
                <div
                    id="create-client-form"
                    role="region"
                    aria-labelledby="toggle-create-client"
                    className={cn(
                        "grid transition-[grid-template-rows,opacity] duration-200 ease-out",
                        showCreateForm
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0",
                    )}
                >
                    <div className="overflow-hidden">
                        <Card className="border-dashed transition-shadow duration-150 hover:shadow-sm">
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    Nouveau client
                                </CardTitle>
                                <CardDescription>
                                    Renseignez les informations du client. Les
                                    champs Nom et Prénom sont obligatoires.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form
                                    action={formAction}
                                    className="space-y-4"
                                    noValidate
                                >
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-nom">
                                                Nom{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="new-nom"
                                                name="nom"
                                                value={nom}
                                                onChange={(e) => {
                                                    setNom(e.target.value);
                                                    if (errors.nom)
                                                        setErrors((e) => ({
                                                            ...e,
                                                            nom: undefined,
                                                        }));
                                                }}
                                                placeholder="Dupont"
                                                aria-required
                                                aria-invalid={!!errors.nom}
                                                aria-describedby={
                                                    errors.nom
                                                        ? "new-nom-error"
                                                        : undefined
                                                }
                                                className={cn(
                                                    errors.nom &&
                                                        "border-destructive focus-visible:ring-destructive/20",
                                                )}
                                            />
                                            {errors.nom && (
                                                <p
                                                    id="new-nom-error"
                                                    className="text-xs text-destructive"
                                                    role="alert"
                                                >
                                                    {errors.nom}
                                                </p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="new-prenom">
                                                Prénom{" "}
                                                <span className="text-destructive">
                                                    *
                                                </span>
                                            </Label>
                                            <Input
                                                id="new-prenom"
                                                name="prenom"
                                                value={prenom}
                                                onChange={(e) => {
                                                    setPrenom(e.target.value);
                                                    if (errors.prenom)
                                                        setErrors((e) => ({
                                                            ...e,
                                                            prenom: undefined,
                                                        }));
                                                }}
                                                placeholder="Marie"
                                                aria-required
                                                aria-invalid={!!errors.prenom}
                                                aria-describedby={
                                                    errors.prenom
                                                        ? "new-prenom-error"
                                                        : undefined
                                                }
                                                className={cn(
                                                    errors.prenom &&
                                                        "border-destructive focus-visible:ring-destructive/20",
                                                )}
                                            />
                                            {errors.prenom && (
                                                <p
                                                    id="new-prenom-error"
                                                    className="text-xs text-destructive"
                                                    role="alert"
                                                >
                                                    {errors.prenom}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-email">
                                            Email (optionnel)
                                        </Label>
                                        <Input
                                            id="new-email"
                                            name="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            placeholder="client@exemple.fr"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new-telephone">
                                            Téléphone (optionnel)
                                        </Label>
                                        <Input
                                            id="new-telephone"
                                            name="telephone"
                                            type="tel"
                                            value={telephone}
                                            onChange={(e) =>
                                                setTelephone(e.target.value)
                                            }
                                            placeholder="06 12 34 56 78"
                                        />
                                    </div>
                                    <div className="flex gap-2 pt-2">
                                        <Button
                                            type="submit"
                                            className="flex-1"
                                            disabled={isPending}
                                        >
                                            {isPending
                                                ? "Enregistrement..."
                                                : "Enregistrer le client"}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={handleCancelCreate}
                                            aria-label="Annuler et masquer le formulaire"
                                        >
                                            Annuler
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

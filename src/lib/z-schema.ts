import z from "zod";

export const signUpSchema = z.object({
    nom: z
        .string("Votre nom est invalide")
        .min(3, "Votre nom doit contenir au moins 3 caractères"),
    prenom: z
        .string("Votre prénom est invalide")
        .min(3, "Votre prénom doit contenir au moins 3 caractères"),
    email: z.email("Votre adresse email est invalid"),
    password: z
        .string("Votre mot de passe est invalide")
        .min(8, "Votre mot de passe doit contenir au moins 8 caractères"),
});

export const signInSchema = z.object({
    email: z.email("Votre adresse email est invalid"),
    password: z
        .string("Votre mot de passe est invalide")
        .min(8, "Votre mot de passe doit contenir au moins 8 caractères"),
});

export const clientSchema = z.object({
    id: z.string("L'id est invalide").optional(),
    nom: z
        .string("Le nom est invalide")
        .min(3, "Le nom doit contenir au moins 3 caractères"),
    prenom: z
        .string("Le prénom est invalide")
        .min(3, "Le prénom doit contenir au moins 3 caractères"),
    email: z.email("Le adresse email est invalid").optional().nullable(),
    telephone: z
        .string("Le numéro de téléphone est invalide")
        .min(10, "Le numéro de téléphone doit contenir au moins 10 caractères")
        .optional()
        .nullable(),
});
export const clientsSchema = z.array(clientSchema);

export const TypeTauxEnum = z.enum(["annuel", "mensuel"]);
export const StatutSimulationEnum = z.enum(["DRAFT", "CONFIRMED", "ARCHIVED"]);
export const simulationSchema = z.object({
    id: z.string().optional(),
    taux: z.number().positive("Le taux doit être positif"),
    typeTaux: TypeTauxEnum,
    dateTraitement: z.coerce.date(),
    operateurId: z.string(),
    createdAt: z.date().optional(),
});
export const simulationsSchema = z.array(simulationSchema);
export const simulationResultSchema = z.object({
    id: z.string().uuid().optional(),
    montant: z.number().positive("Le montant doit être positif"),
    duree: z.number().int().positive("La durée doit être supérieure à 0"),
    mensualite: z.number().positive("La mensualité doit être positive"),
    totalInterets: z.number().min(0),
    totalAssurance: z.number().min(0).nullable().optional(),
    statut: StatutSimulationEnum.default("DRAFT"),
    clientId: z.string().uuid(),
    simulationId: z.string().optional(),
    createdAt: z.date().optional(),
});
export const simulationResultsSchema = z.array(simulationResultSchema);

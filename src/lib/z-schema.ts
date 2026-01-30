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

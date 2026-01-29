import z from "zod";

export const signUpSchema = z.object({
    nom: z
        .string("Votre nom est invalide")
        .min(3, "Votre nom doit contenir au moins 3 caractères"),
    prenom: z
        .string("Votre prénom est invalide")
        .min(3, "Votre nom doit contenir au moins 3 caractères"),
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

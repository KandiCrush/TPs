"use server";

import prisma from "@/src/lib/prisma";
import { clientSchema } from "@/src/lib/z-schema";
import { ClientType } from "@/src/lib/z-type";

export async function createClientAction(
    prevState: { error?: boolean; message?: string; client?: ClientType },
    formData: FormData,
) {
    const validatedFiels = clientSchema.safeParse({
        nom: formData.get("nom") as string,
        prenom: formData.get("prenom") as string,
        email: formData.get("email") as string | null,
        telephone: formData.get("telephone") as string | null,
    });

    if (!validatedFiels.success) {
        console.log(validatedFiels.error.flatten().fieldErrors);

        return {
            error: true,
            message: Object.entries(validatedFiels.error.flatten().fieldErrors)
                .map((field) => field)
                .join(", "),
        };
    }

    try {
        const newClient = await prisma.client.create({
            data: validatedFiels.data,
        });
        return {
            error: false,
            message: "Le client a été enregistré avec succès",
            data: newClient,
        };
    } catch (error) {
        console.log("Erreur lors de l'enregistrement du nouveau client", error);

        return {
            error: true,
            message: "Erreur lors de l'enregistrement du nouveau client",
            data: null,
        };
    }
}

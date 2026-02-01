"use server";

import { revalidatePath } from "next/cache";
import prisma from "./prisma";

export const handleDeleted = async (id: string) => {
    await prisma.simulationResult.update({
        where: {
            id,
        },
        data: {
            statut: "DELETED",
        },
    });

    revalidatePath("/finance");
};

export const handleValidated = async (id: string) => {
    await prisma.simulationResult.update({
        where: {
            id,
        },
        data: {
            statut: "VALIDATED",
        },
    });

    revalidatePath("/finance");
};

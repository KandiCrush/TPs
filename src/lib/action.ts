"use server";

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
};

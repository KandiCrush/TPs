import { auth } from "@/src/lib/auth-lib/auth";
import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth.api.getSession(req);

    if (!session?.user) {
        return NextResponse.json(
            { error: true, message: "Unauthorized" },
            { status: 401 }
        );
    }

    const operateur = await prisma.operateur.findUnique({
        where: { userId: session.user.id },
    });
    if (!operateur) {
        return NextResponse.json(
            {
                error: true,
                message: "Aucun opérateur associé à cet utilisateur",
            },
            { status: 400 }
        );
    }

    const body = await req.json();

    const simulation = await prisma.simulationResult.findUnique({
        where: {
            id: body.id,
        },
        include: {
            simulation: true,
        },
    });

    if (!simulation) {
        return NextResponse.json(
            { error: true, message: "Simulation non trouvée" },
            { status: 404 }
        );
    }

    if (simulation.simulation.operateurId !== operateur.id) {
        return NextResponse.json(
            {
                error: true,
                message:
                    "Vous n'avez pas les permissions pour supprimer cette simulation",
            },
            { status: 403 }
        );
    }

    await prisma.simulationResult.update({
        where: {
            id: body.id,
        },
        data: {
            statut: "DELETED",
        },
    });

    return NextResponse.json({
        error: false,
        message: "Simulation supprimée avec succès",
    });
}

import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";
import { simulationSchema, simulationResultsSchema } from "@/src/lib/z-schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await auth.api.getSession(req);

    if (!session?.user) {
        return NextResponse.json(
            { error: true, message: "Unauthorized" },
            { status: 401 },
        );
    }

    let body;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: true, message: "Body invalide" },
            { status: 400 },
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
            { status: 400 },
        );
    }

    body.simulation.operateurId = operateur.id;
    const simData = simulationSchema.safeParse(body.simulation);
    if (!simData.success) {
        console.log(simData.error.flatten().fieldErrors);
        return NextResponse.json({
            error: true,
            message: "Données de simulation invalides",
            details: simData.error.flatten(),
        });
    }

    const simResults = simulationResultsSchema.safeParse(body.details);

    if (!simResults.success) {
        console.log(simResults.error.flatten().fieldErrors);
        return NextResponse.json({
            error: true,
            message: "Détails de simulation (resultats) invalides",
            details: simResults.error.flatten(),
        });
    }

    try {
        const newSimulation = await prisma.simulationSession.create({
            data: {
                taux: simData.data.taux,
                typeTaux:
                    simData.data.typeTaux == "annuel" ? "ANNUEL" : "MENSUEL",
                operateurId: simData.data.operateurId,
                dateTraitement: simData.data.dateTraitement,
            },
        });

        await prisma.simulationResult.createMany({
            data: simResults.data.map((result) => ({
                montant: result.montant,
                duree: result.duree,
                mensualite: result.mensualite,
                totalInterets: result.totalInterets,
                totalAssurance: result.totalAssurance ?? null,
                clientId: result.clientId,
                simulationId: newSimulation.id,
            })),
        });

        return NextResponse.json({
            error: false,
            message: "Simulation enregistrée avec succès",
            simulationId: newSimulation.id,
        });
    } catch (error) {
        console.error("Erreur simulation:", error);

        return NextResponse.json(
            {
                error: true,
                message:
                    "Une erreur s'est produite lors de l'enregistrement de la simulation",
            },
            { status: 500 },
        );
    }
}

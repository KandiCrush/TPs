import { auth } from "@/src/lib/auth-lib/auth";
import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";
/**
 * Enregistre une seule simulation : crée le client, la session et le résultat.
 * Respecte strictement les schémas Prisma existants.
 */
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

    let body: {
        client: { nom: string; prenom: string; email?: string };
        simulation: {
            taux: number;
            typeTaux: "ANNUEL" | "MENSUEL";
            dateTraitement: string;
        };
        detail: {
            montant: number;
            duree: number;
            mensualite: number;
            totalInterets: number;
            totalAssurance?: number | null;
        };
    };

    try {
        body = await req.json();
    } catch {
        return NextResponse.json(
            { error: true, message: "Body invalide" },
            { status: 400 }
        );
    }

    const { client: clientData, simulation: simData, detail } = body;

    if (
        !clientData?.nom ||
        !clientData?.prenom ||
        simData?.taux == null ||
        !simData?.typeTaux ||
        !simData?.dateTraitement ||
        detail?.montant == null ||
        detail?.duree == null ||
        detail?.mensualite == null ||
        detail?.totalInterets == null
    ) {
        return NextResponse.json(
            { error: true, message: "Données incomplètes" },
            { status: 400 }
        );
    }

    if (simData.typeTaux !== "ANNUEL" && simData.typeTaux !== "MENSUEL") {
        return NextResponse.json(
            { error: true, message: "typeTaux doit être ANNUEL ou MENSUEL" },
            { status: 400 }
        );
    }

    try {
        const client = await prisma.client.create({
            data: {
                nom: clientData.nom,
                prenom: clientData.prenom,
                email: clientData.email ?? null,
            },
        });

        const simulationSession = await prisma.simulationSession.create({
            data: {
                taux: simData.taux,
                typeTaux: simData.typeTaux,
                dateTraitement: new Date(simData.dateTraitement),
                operateurId: operateur.id,
            },
        });

        await prisma.simulationResult.create({
            data: {
                montant: detail.montant,
                duree: detail.duree,
                mensualite: detail.mensualite,
                totalInterets: detail.totalInterets,
                totalAssurance: detail.totalAssurance ?? null,
                clientId: client.id,
                simulationId: simulationSession.id,
            },
        });

        return NextResponse.json({
            error: false,
            message: "Simulation enregistrée avec succès",
            simulationId: simulationSession.id,
        });
    } catch (error) {
        console.error("Erreur enregistrement simulation:", error);
        return NextResponse.json(
            {
                error: true,
                message:
                    "Une erreur s'est produite lors de l'enregistrement de la simulation",
            },
            { status: 500 }
        );
    }
}

import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { id } = body;

    if (!id) {
        return new Response("ID manquant", { status: 400 });
    }

    const document = await prisma.simulationDocument.findUnique({
        where: { id },
    });

    if (!document) {
        return new Response("Document introuvable", { status: 404 });
    }

    return new Response(document.fichier, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${document.nom}"`,
        },
    });
}

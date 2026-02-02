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

    // 🔹 Déterminer le type MIME
    let contentType = "application/octet-stream";

    if (document.type === "PDF") {
        contentType = "application/pdf";
    }

    if (document.type === "EXCEL") {
        contentType =
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    }

    return new Response(document.fichier, {
        headers: {
            "Content-Type": contentType,
            "Content-Disposition": `attachment; filename="${document.nom}"`,
        },
    });
}

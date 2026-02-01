import prisma from "@/src/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const filename = req.headers.get("X-Filename") ?? "simulation.pdf";

    const buffer = Buffer.from(await req.arrayBuffer());

    await prisma.simulationDocument.create({
        data: {
            nom: filename,
            type: "PDF",
            fichier: buffer,
        },
    });

    return NextResponse.json({ success: true });
}

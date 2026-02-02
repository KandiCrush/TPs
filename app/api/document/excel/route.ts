import prisma from "@/src/lib/prisma";
import { generateSimulationExcel } from "@/src/lib/sim-excel/generateSimulationExcel";

export async function POST(req: Request) {
    const body = await req.json();
    const buffer = await generateSimulationExcel(body);
    const filename = `simulation-${Date.now()}.xlsx`;

    await prisma.simulationDocument.create({
        data: {
            nom: filename,
            type: "EXCEL",
            fichier: Buffer.from(buffer),
        },
    });

    return new Response(new Uint8Array(buffer), {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="${filename}"`,
        },
    });
}

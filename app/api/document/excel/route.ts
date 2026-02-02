import { generateSimulationExcel } from "@/src/lib/sim-excel/generateSimulationExcel";

export async function POST(req: Request) {
    const body = await req.json();

    const buffer = await generateSimulationExcel(body);

    const uint8 = new Uint8Array(buffer);

    return new Response(uint8, {
        headers: {
            "Content-Type":
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "Content-Disposition": `attachment; filename="simulation.xlsx"`,
        },
    });
}

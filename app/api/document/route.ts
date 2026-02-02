import { auth } from "@/src/lib/auth-lib/auth";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
    const session = await auth.api.getSession(req);

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const documents = await prisma.simulationDocument.findMany({
        orderBy: [
            {
                nom: "desc",
            },
        ],
    });

    return Response.json({ documents });
}

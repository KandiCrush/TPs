import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function GET(req: Request) {
    const session = await auth.api.getSession(req);

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const clients = await prisma.client.findMany({
        orderBy: [
            {
                prenom: "desc",
            },
        ],
    });

    return Response.json({ clients });
}

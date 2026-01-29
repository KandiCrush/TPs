import { auth } from "@/src/lib/auth";
import prisma from "@/src/lib/prisma";

export async function POST(req: Request) {
    const session = await auth.api.getSession(req);

    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    await prisma.operateur.create({
        data: {
            userId: session.user.id,
            nom: session.user.name?.split(" ")[0] ?? "",
            prenom: session.user.name?.split(" ")[1] ?? "",
        },
    });

    return Response.json({ ok: true });
}

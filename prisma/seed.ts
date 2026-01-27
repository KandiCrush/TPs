import "dotenv/config";
import { PrismaClient, Prisma } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Adapter PostgreSQL
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});

// Prisma Client avec adapter
const prisma = new PrismaClient({ adapter });

// Données de seed
const clients: Prisma.ClientCreateInput[] = [
    {
        nom: "Dupont",
        prenom: "Jean",
        email: "jean.dupont@example.com",
        telephone: "+33 6 12 34 56 78",
    },
    {
        nom: "Martin",
        prenom: "Claire",
        email: "claire.martin@example.com",
        telephone: "+33 6 98 76 54 32",
    },
    {
        nom: "Ngoma",
        prenom: "Patrick",
        email: "patrick.ngoma@example.com",
        telephone: "+243 99 12 34 56",
    },
    {
        nom: "Kawanda",
        prenom: "Aline",
        email: "aline.kabasele@example.com",
        telephone: "+243 81 45 67 89",
    },
];

// Seed principal
export async function main() {
    for (const client of clients) {
        await prisma.client.create({
            data: client,
        });
    }

    console.log("Seed clients terminé ✅");
}

// Exécution
main()
    .catch((e) => {
        console.error("Erreur seed ❌", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

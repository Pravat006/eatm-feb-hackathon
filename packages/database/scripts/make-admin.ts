import { PrismaClient } from '../src';

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log("Users found:", users.length);

    if (users.length > 0) {
        const targetUser = users[0];
        const updated = await prisma.user.update({
            where: { id: targetUser.id },
            data: { role: "ADMIN" } // or SUPER_ADMIN depending on what they want. They said "admin".
        });
        console.log(`Updated user ${updated.email} (${updated.name}) to ADMIN.`);

        // Also, if they need to be in a campus to make reports, let's ensure they have a campus
        if (!updated.campusId) {
            // Let's create a dummy campus
            let campus = await prisma.campus.findFirst();
            if (!campus) {
                campus = await prisma.campus.create({
                    data: {
                        name: "Default Campus",
                        type: "UNIVERSITY",
                        status: "ACTIVE",
                    }
                });
            }

            await prisma.user.update({
                where: { id: targetUser.id },
                data: { campusId: campus.id }
            });
            console.log(`Assigned user to campus: ${campus.name}`);
        }
    } else {
        console.log("No users found in DB to update.");
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })

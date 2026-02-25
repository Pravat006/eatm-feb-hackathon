import prisma from '@repo/db';

async function main() {
    console.log("Seeding exact roles for the 4 known users...");

    // 1. Create a Seed Campus
    let campus = await prisma.campus.findFirst({
        where: { name: "EATM Hackathon Campus" }
    });

    if (!campus) {
        campus = await prisma.campus.create({
            data: {
                name: "EATM Hackathon Campus",
                type: "COLLEGE",
                status: "ACTIVE", // Super Admin has technically approved this
            }
        });
        console.log(`Created new active campus: ${campus.name}`);
    } else {
        console.log(`Found existing campus: ${campus.name}`);
    }

    // Define target mapping
    const roleMapping = {
        'minuszero6969@gmail.com': { role: 'SUPER_ADMIN', campusId: null },
        'darkalok71@gmail.com': { role: 'ADMIN', campusId: campus.id },
        'beherapravat836@gmail.com': { role: 'MANAGER', campusId: campus.id },
        'testpravat@gmail.com': { role: 'USER', campusId: campus.id },
    };

    const users = await prisma.user.findMany();

    for (const user of users) {
        // @ts-ignore
        const target = roleMapping[user.email];
        if (target) {
            await prisma.user.update({
                where: { email: user.email },
                data: {
                    role: target.role,
                    campusId: target.campusId
                }
            });
            console.log(`Updated ${user.email} -> ${target.role}`);
        }
    }

    console.log("--- FINAL USER STATE ---");
    const finalUsers = await prisma.user.findMany({ select: { name: true, email: true, role: true, campusId: true } });
    console.table(finalUsers);
}

main()
    .then(() => console.log('Done'))
    .catch(console.error);

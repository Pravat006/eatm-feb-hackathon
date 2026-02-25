import db from "../src/services/db";

async function main() {
    const clerkId = "user_3A9sBwPbYbzxb1bTvdMWhRKo4ll";
    const email = "darkalok71@gmail.com";
    const name = "dark alok";
    const role = "SUPER_ADMIN";

    console.log(`Seeding user: ${name} (${email}) as ${role}...`);

    const user = await db.user.upsert({
        where: { email },
        update: {
            clerkId,
            name,
            role,
        },
        create: {
            clerkId,
            email,
            name,
            role,
        }
    });

    console.log("✅ Seed complete! User details:");
    console.table({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clerkId: user.clerkId
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => db.$disconnect());

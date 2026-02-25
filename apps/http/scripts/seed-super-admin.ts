/**
 * Super Admin Seeder
 * Run: npx tsx scripts/seed-super-admin.ts
 *
 * Updates an existing user (identified by Clerk ID or email)
 * to SUPER_ADMIN role. Run this ONCE after the user signs up
 * via the frontend.
 */

import { PrismaClient } from "@repo/db";

const db = new PrismaClient();

// ── CONFIGURE THESE ──────────────────────────────────────────
const SUPER_ADMIN_EMAIL = "your-email@example.com"; // ← change this
// ─────────────────────────────────────────────────────────────

async function main() {
    const user = await db.user.findUnique({
        where: { email: SUPER_ADMIN_EMAIL },
    });

    if (!user) {
        console.error(`❌ No user found with email: ${SUPER_ADMIN_EMAIL}`);
        console.error("   Sign up via the frontend first, then re-run this script.");
        process.exit(1);
    }

    const updated = await db.user.update({
        where: { email: SUPER_ADMIN_EMAIL },
        data: { role: "SUPER_ADMIN" },
        select: { id: true, name: true, email: true, role: true },
    });

    console.log("✅ Super Admin created successfully:");
    console.table(updated);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => db.$disconnect());

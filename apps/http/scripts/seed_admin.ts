import prisma from '@repo/db';

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users found:", users.length);

  if (users.length > 0) {
    // Pick the first one (or modify the specific email if needed)
    const targetUser = users[0];
    const updated = await prisma.user.update({
      where: { id: targetUser.id },
      data: { role: "ADMIN" }
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
            type: "COLLEGE",
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
    console.log("Seeding done.");
  })
  .catch(async (e) => {
    console.error(e)
    process.exit(1)
  })

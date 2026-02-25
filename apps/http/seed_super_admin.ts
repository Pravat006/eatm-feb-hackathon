import prisma from '@repo/db';
async function main() {
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true } });
  
  if (users.length > 0) {
    const updated = await prisma.user.update({
      where: { id: users[1].id }, // update the second user as super admin
      data: { role: 'SUPER_ADMIN' }
    });
    console.log(`Updated user ${updated.email} (${updated.name}) to SUPER_ADMIN.`);
  }

  const result = await prisma.user.findMany({ select: { name: true, email: true, role: true } });
  console.table(result);
}
main().then(() => console.log('Done')).catch(console.error);

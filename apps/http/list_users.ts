import prisma from '@repo/db';
async function main() {
  const users = await prisma.user.findMany({ select: { name: true, email: true, role: true } });
  console.table(users);
}
main().then(() => console.log('Done')).catch(console.error);

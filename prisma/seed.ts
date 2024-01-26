import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const main = async () => {
  // seed data for roles
  const rolesData = [
    { name: 'admin' },
    { name: 'user' },
    // Add more roles if needed
  ];

  // Seed data for actions
  const actionsData = [
    { name: 'create' },
    { name: 'read' },
    { name: 'update' },
    { name: 'delete' },
  ];

  // Seed data for entities
  const entitiesData = [
    { name: 'users' },
    { name: 'roles' },
    { name: 'permissions' },
    // Add more entities if needed
  ];

  // Insert roles into the database
  await prisma.role.createMany({
    data: rolesData,
  });

  // Insert actions into the database
  await prisma.action.createMany({
    data: actionsData,
  });

  // Insert entities into the database
  await prisma.entity.createMany({
    data: entitiesData,
  });

  // Seed data for permissions
  const permissionsData = [
    // Admin has full access to all actions on both entities
    { roleId: 1, entityId: 1, actionId: 1 },
    { roleId: 1, entityId: 1, actionId: 2 },
    { roleId: 1, entityId: 1, actionId: 3 },
    { roleId: 1, entityId: 1, actionId: 4 },
    { roleId: 1, entityId: 2, actionId: 1 },
    { roleId: 1, entityId: 2, actionId: 2 },
    { roleId: 1, entityId: 2, actionId: 3 },
    { roleId: 1, entityId: 2, actionId: 4 },
    { roleId: 1, entityId: 3, actionId: 1 },
    { roleId: 1, entityId: 3, actionId: 2 },
    { roleId: 1, entityId: 3, actionId: 3 },
    { roleId: 1, entityId: 3, actionId: 4 },
  ];

  // Insert permissions into the database
  await prisma.permission.createMany({
    data: permissionsData,
  });
};

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

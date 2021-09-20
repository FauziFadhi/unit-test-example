import { Migration } from '@config/database/migration.provider';
import { hash } from 'bcrypt';

import { Permission } from '../../models/core/Permission';
import { Role } from '../../models/core/Role';
import { RolePermission } from '../../models/core/RolePermission';
import { User } from '../../models/core/User';
import { UserLogin } from '../../models/core/UserLogin';
import { UserRole } from '../../models/core/UserRole';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    const userLogin = await UserLogin.create({
      username: 'fauzifadhi',
      password: await hash('chelsea24', 10),
      isActive: true,
    });
    const role = await Role.create({
      name: 'Admin',
    });

    const permission = await Permission.bulkCreate([
      {
        name: 'CAN_VIEW_USER',
        key: 'CAN_VIEW_USER',
      },
      {
        name: 'CAN_ADD_USER',
        key: 'CAN_ADD_USER',
      },
      {
        name: 'CAN_UPDATE_USER',
        key: 'CAN_UPDATE_USER',
      },
      {
        name: 'CAN_DELETE_USER',
        key: 'CAN_DELETE_USER',
      },
    ]);

    const user = await User.create({
      name: 'fauzi Fadhillah',
      email: 'fauzifadhi@gmail.com',
      phone: '083822300920',
      userLoginId: userLogin.id,
    });

    await UserRole.create({
      userId: user.id,
      roleId: role.id,
    });

    await RolePermission.bulkCreate([
      {
        permissionId: permission[0].id,
        roleId: role.id,
      },
      {
        permissionId: permission[1].id,
        roleId: role.id,
      },
    ]);
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('table_name');
  });
};

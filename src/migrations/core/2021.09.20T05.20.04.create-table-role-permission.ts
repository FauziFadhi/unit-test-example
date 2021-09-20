import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('role_permission', {
      role_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          key: 'id',
          model: 'role',
        },
      },
      permission_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          key: 'id',
          model: 'permission',
        },
      },
    });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('role_permission');
  });
};

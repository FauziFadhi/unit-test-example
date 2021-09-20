import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('user_role', {
      user_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          key: 'id',
          model: 'user',
        },
      },
      role_id: {
        type: DataType.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          key: 'id',
          model: 'role',
        },
      },
    });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.dropTable('user_role');
  });
};

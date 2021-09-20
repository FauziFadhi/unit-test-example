import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('permission', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataType.STRING,
        allowNull: false,
      },
      key: {
        type: DataType.STRING,
        allowNull: false,
      },
      created_at: DataType.DATE,
      updated_at: DataType.DATE,
      is_deleted: {
        type: DataType.BOOLEAN,
        defaultValue: false,
      },
    });

    await queryInterface.addIndex('permission', ['is_deleted', 'key']);
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('permission', ['is_deleted', 'key']);
    await queryInterface.dropTable('permission');
  });
};

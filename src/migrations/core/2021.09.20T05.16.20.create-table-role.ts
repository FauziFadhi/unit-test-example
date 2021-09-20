import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.createTable('role', {
      id: {
        type: DataType.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
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

    await queryInterface.addIndex('role', ['is_deleted', 'name']);
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('role', ['is_deleted', 'name']);
    await queryInterface.dropTable('role');
  });
};

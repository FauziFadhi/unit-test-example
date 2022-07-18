import { Migration } from '@config/database/migration.provider';
import { DataType } from 'sequelize-typescript';

export const databasePath = __dirname;

export const up: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('role', ['name'], { where: { deleted_at: null } });

    await queryInterface.addIndex('role', ['name'], { unique: true, where: { deleted_at: null } });
  });
};
export const down: Migration = async ({ context: queryInterface }) => {
  await queryInterface.sequelize.transaction(async (transaction) => {
    await queryInterface.removeIndex('role', ['name'], { unique: true, where: { deleted_at: null } });
    await queryInterface.addIndex('role', ['name'], { where: { deleted_at: null } });
  });
};

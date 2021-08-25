import { SequelizeStorage, Umzug } from 'umzug';

import * as fs from 'fs';
import { dbConfig } from './database-core.config';
import { Sequelize } from 'sequelize-typescript';
import { databasePath } from '../../migrations/migration-template';

/** DATABASE MIGRATOR */
const sequelize = new Sequelize(dbConfig);

export const migrator = new Umzug({
  migrations: {
    glob: ['core/*.ts', { cwd: databasePath }],
  },
  create: {
    folder: `${databasePath}/core`,
    template: (filepath) => [
      [
        filepath,
        fs.readFileSync(`${databasePath}/migration-template.ts`).toString(),
      ],
    ],
  },
  context: sequelize.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize: sequelize,
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;

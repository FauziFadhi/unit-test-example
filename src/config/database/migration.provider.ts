import { SequelizeStorage, Umzug } from 'umzug';

import * as fs from 'fs';
import { Sequelize } from 'sequelize-typescript';
import { databasePath } from '../../migrations/migration-template';
import config from './config';

/** DATABASE MIGRATOR */
const sequelize = new Sequelize(config);

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

import * as dotenv from 'dotenv';
import * as fs from 'fs';
import sequelize from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import { SequelizeStorage, Umzug } from 'umzug';

import { databasePath } from './migrations/migration-template';

export const Op = sequelize.Op;

// export const seq = sequelize;

let env: any = null;
if (!process.env.DB_NAME) env = dotenv.parse(fs.readFileSync('.env'));

const usedEnv = env || process.env;

export const db = new Sequelize({
  dialect: 'mysql',
  logging: console.log,
  logQueryParameters: true,
  define: {
    underscored: true,
  },
  replication: {
    read: [
      {
        database: usedEnv.DB_READ_NAME,
        username: usedEnv.DB_READ_USERNAME,
        password: usedEnv.DB_READ_PASSWORD,
        host: usedEnv.DB_READ_HOST,
        port: +usedEnv.DB_READ_PORT,
      },
    ],
    write: {
      database: usedEnv.DB_NAME,
      username: usedEnv.DB_USERNAME,
      password: usedEnv.DB_PASSWORD,
      host: usedEnv.DB_HOST,
      port: +usedEnv.DB_PORT,
    },
  },
  dialectOptions: {
    decimalNumbers: true,
    timezone: '+07:00',
  },
  timezone: '+07:00',
});

export const dbLog = new Sequelize({
  dialect: 'mysql',
  database: usedEnv.DBLOG_NAME,
  username: usedEnv.DBLOG_USERNAME,
  password: usedEnv.DBLOG_PASSWORD,
  host: usedEnv.DBLOG_HOST,
  port: +usedEnv.DBLOG_PORT,
  logging: console.log,
  logQueryParameters: true,
  define: {
    underscored: true,
  },
  dialectOptions: {
    timezone: '+07:00',
    decimalNumbers: true,
  },
  timezone: '+07:00',
});

/** DATABASE MIGRATOR */
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
  context: db.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize: db,
  }),
  logger: console,
});

export type Migration = typeof migrator._types.migration;

/** DATABASE MIGRATOR */
export const migratorLog = new Umzug({
  migrations: {
    glob: ['log/*.ts', { cwd: databasePath }],
  },
  create: {
    folder: `${databasePath}/log`,
    template: (filepath) => [
      [
        filepath,
        fs.readFileSync(`${databasePath}/migration-template.ts`).toString(),
      ],
    ],
  },
  context: dbLog.getQueryInterface(),
  storage: new SequelizeStorage({
    sequelize: dbLog,
  }),
  logger: console,
});

export type MigrationLog = typeof migratorLog._types.migration;

require('ts-node/register');

require('./src/common/database/database.config.ts').migrator.runAsCLI();

## Requirement
- NodeJs >= 14 LTS
- NestJs [V8](https://nestjs.com/)
- ORM [Sequelize-Typescript v2.1.0](https://www.npmjs.com/package/sequelize-typescript)
- Cache Management [base-repo](https://github.com/FauziFadhi/base-repo) (extending sequelize function with cache feature)
- Base ORM [Sequelize v6](https://sequelize.org/master/)
- Database Migration [Umzug](https://github.com/sequelize/umzug)

# How To Install


- Open your project folder
- run ``` npm i -g ts-node ```
- open base-code repo with your browser
- and copy repository git url
- and replace `<this_git_url>` with copied url to get all file from base-code repo with the following command
- run the command from your project root directory
### Command
```
git pull <this_git_url> master --allow-unrelated-histories
```
### Example
this is example of command if i copy url from base-code repository
```
git pull https://fauzifadh@bitbucket.org/rollingglory/node-basecode.git master --allow-unrelated-histories
```
- run `npm install`
- create public and secret key for example authentication and paste it inside `./src/modules/_common/auth/secret/` directory
- make your .env based on .env.example and fill the minimum required environment property
- run `npm run migration --db=migrate up` or `ts-node migrate up` to run example database migration from migrate.ts file

- `npm run start:dev` to run your project with hot Reload

### Folder Structure

 ```Incoming```
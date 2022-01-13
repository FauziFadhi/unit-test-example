## Requirement
- NodeJs >= 16 LTS 
- [Typescript 4.5](https://www.typescriptlang.org/docs/)
- NestJs [V8](https://nestjs.com/)
- ORM [Sequelize-Typescript v2.1.2](https://www.npmjs.com/package/sequelize-typescript)
- Cache Management [base-repo](https://github.com/FauziFadhi/base-repo) (extending sequelize function with cache feature)
- Base ORM [Sequelize v6](https://sequelize.org/master/)
- Database Migration [Umzug](https://github.com/sequelize/umzug)
- Validator [Class Validator](https://github.com/typestack/class-validator)

# How To Install


- Open your project folder
- run ``` npm i -g ts-node ```
- open base-code repo with your browser
- and copy repository git url
- and replace `<this_git_url>` with copied url to get all file from base-code repo with the following command
- run the command from your project root directory
## Command
```
git pull <this_git_url> master --allow-unrelated-histories
```
## Example
this is example of command if i copy url from base-code repository
```
git pull https://fauzifadh@bitbucket.org/rollingglory/node-basecode.git master --allow-unrelated-histories
```
- run `npm install`
- create public and secret key for example authentication and paste it inside `./src/modules/_common/auth/secret/` directory
- make your .env based on .env.example and fill the minimum required environment property
- run `npm run migration --db=migrate -- up` or `ts-node migrate up` to run example database migration from migrate.ts file

- `npm run start:dev` to run your project with hot Reload

### Example Implementation
- you can see example of implementation at `src/apps/example` folder

----

# Http Request
if your project need to request to 3rd Party API please install `@nestjs/axios` [Nestjs Axios](https://www.npmjs.com/package/@nestjs/axios)
from that library because the return type is `Observable` and from `rxjs` `.toPromise()` is deprecated.
please use `LastValueFrom` or `firstValueFrom`.
## Example
please use
```
const resp = await lastValueFrom(this.httpService.post())
```
instead of
```
const resp = await this.httpService.post().toPromise()

```

# Custom Cache
if you want to use custom cache with custom key, you can follow this [instruction](https://docs.nestjs.com/techniques/caching#interacting-with-the-cache-store)
### Folder Structure

 ```Incoming```

 - src
 - - modules
 - - - _common // `business logic function that can be used at 'apps' and 'cms' module`
 - - - apps
 - - - cms
 - - - middleware // `base logic to intgerate with 3rd Party`
 - - config // `place your 3rd party config, app config here`
 - - migration // `place for migration file`
 - - models // `place for model`
 - - - core // `place for model if you has 2 or more database, and place your core data to this folder`
 - - - log // `place to this folder all model for log if you has seperate database for logging`
 - - utils
 - - - constant `create new file of constant into this folder based on context of your constant`
 - - - - index `export all constant file that your created here`
 - - - - auth `place all constant that has content for authentication here`
 - - - enum `create new file of enum here`
 - - - - file
 - - - ErrorCode `place your error code file here`
 - - - - payment `place your error code for payment context here`
 - - - all-exception-filter.ts `all of your error going to this file before returned to frontend`
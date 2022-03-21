import 'dotenv/config';
import 'reflect-metadata';
import { InversifyExpressServer } from 'inversify-express-utils';
import * as bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';

import { container } from './ioc/containter';
import { errorCatchMiddleware } from './middlewares';
import { createConnection } from 'typeorm';
import * as entitiesMap from './entities';
import { validationErrorMiddleware } from './middlewares/validation.error.middleware';
import { AuthService } from './services';

const entitiesNames = Object.keys(entitiesMap);
const entities = entitiesNames.map((entityName) => entitiesMap[entityName]);

if (!process.env.SALT) {
  throw new Error('Invalid env config, required: SALT');
}
if (!process.env.DB_HOST) {
  throw new Error('Invalid env config, required: DB_HOST');
}
if (!process.env.DB_PORT) {
  throw new Error('Invalid env config, required: DB_PORT');
}
if (!process.env.DB_ADMIN_USER) {
  throw new Error('Invalid env config, required: DB_ADMIN_USER');
}
if (!process.env.DB_ADMIN_PASS) {
  throw new Error('Invalid env config, required: DB_ADMIN_PASS');
}
if (!process.env.DB) {
  throw new Error('Invalid env config, required: DB');
}
if (!process.env.REDIS_URL) {
  throw new Error('Invalid env config, required: REDIS_URL');
}

Promise.all([
  createConnection({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_ADMIN_USER,
    password: process.env.DB_ADMIN_PASS,
    database: process.env.DB,
    entities,
    synchronize: true,
  }),
]).then(() => {
  const port = process.env.PORT ?? 3001;
  const server = new InversifyExpressServer(container);

  if (!process.env.APP_ADMIN_NAME) {
    throw new Error('Invalid env config, required: APP_ADMIN_NAME');
  }
  if (!process.env.APP_ADMIN_PASSWORD) {
    throw new Error('Invalid env config, required: APP_ADMIN_PASSWORD');
  }

  container
    .resolve<AuthService>(AuthService)
    .createUserAndGetToken({
      name: process.env.APP_ADMIN_NAME,
      password: process.env.APP_ADMIN_PASSWORD,
      isAdmin: true,
    })
    .then((created) => {
      console.log('Admin user created.');
    })
    .catch((err) => {
      console.log('Admin user was not created, probably already exists');
    });

  server.setConfig((theApp) => {
    theApp.use(morgan('combined'));
    theApp.use(
      bodyParser.json({
        limit: '50mb',
      })
    );
    theApp.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    theApp.use(bodyParser.json());
    theApp.options('*', cors());

    theApp.use(cors());
  });

  server.setErrorConfig((theApp) => {
    theApp.use(
      // автоматическая обработка ошибок валидации данных
      validationErrorMiddleware,
      // остальные ошибки
      errorCatchMiddleware
    );
  });

  const app = server.build();
  app.listen(port);
  console.log(`Server started on port ${port} :)`);
});

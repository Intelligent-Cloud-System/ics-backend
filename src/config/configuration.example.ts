export default () => ({
  port: 5000,
  db: {
    type: 'db-type',
    host: 'db-host',
    port: 5432,
    database: 'db-name',
    username: 'db-user',
    password: 'db-password',
    synchronize: false,
    entities: ['dist/entity//*.{ts,js}'],
    ormEntities: ['src/entity//*.ts'],
    migrations: ['src/migration//*.ts'],
    subscribers: ['src/subscriber//*.ts'],
    cli: {
      entitiesDir: 'src/entity',
      migrationsDir: 'src/migration',
      subscribersDir: 'src/subscriber',
    },
  },
  swagger: {
    title: 'ICS',
    description: 'Intelligent file_manager storage',
  },
  aws: {
    region: 'your-aws-region',
    accessKeyId: 'your-aws-accessKeyId',
    secretAccessKey: 'your-aws-secretAccessKey',
    userPoolId: 'your-aws-userPoolId',
  },
  cors: {
    origin: 'cors-app-url',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  },
  file: {
    secretKey: new Array(32).fill(1),
    algorithm: 'crypto-algorithm',
    separator: 'secret-separator',
    storageFolder: 'storage',
  },
});

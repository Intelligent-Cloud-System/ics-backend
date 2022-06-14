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
    description: 'Intelligent file storage',
  },
  aws: {
    accessKeyId: 'your-aws-accessKeyId',
    secretAccessKey: 'your-aws-secretAccessKey',
    cognito: {
      region: 'your-aws-region',
      userPoolId: 'your-aws-region',
    },
    s3: {
      region: 'your-aws-region',
      bucket: 'your-aws-bucket',
      linkTtl: 7200,
    },
  },
  cors: {
    origin: 'cors-app-url',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  }
});

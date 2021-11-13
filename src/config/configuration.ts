export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  db: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
    database: process.env.DATABASE_NAME,
    username: process.env.DB_USER_NAME,
    password: process.env.DB_USER_PASSWORD,
  },
});

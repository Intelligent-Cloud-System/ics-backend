export default () => ({
  swagger: {
    title: 'ICS',
    description: 'Intelligent file storage',
  },
  port: parseInt(process.env.PORT, 10) || 3000,
});

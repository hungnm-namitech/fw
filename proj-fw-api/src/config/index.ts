export default () => ({
  jwtSecret: process.env.JWT_SECRET,
  seederToken: process.env.SEEDER_TOKEN,
});

import fastify from './index';
import { sequelize } from './initializers/db';

(async () => {
  try {
    await sequelize.authenticate();
    await fastify.listen(process.env.PORT || 3000, '0.0.0.0');
  } catch (err) {
    console.log(err);
  }
})();

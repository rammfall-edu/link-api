import Fastify from 'fastify';
import { hash, compare } from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';

import User from './models/User';
import { isUserExist } from './utils/user';

const fastify = Fastify({
  logger: true,
});
const SECRET_KEY = process.env.SECRET_KEY || 'secret';

fastify.register(import('@fastify/cors'));
fastify.register(import('@fastify/multipart'), {
  addToBody: true,
});
fastify.register(import('@fastify/cookie'));

fastify.post('/register', {}, async (request, reply) => {
  const { email, password } = request.body;

  if (await isUserExist(email)) {
    return reply
      .status(400)
      .send({ field: 'email', info: 'User already exist' });
  }

  const user = new User();

  user.email = email;
  user.password = await hash(password, 10);
  await user.save();

  reply.send({ info: 'User successful created' });
});

fastify.post('/login', {}, async (request, reply) => {
  const { email, password } = request.body;

  if (!(await isUserExist(email))) {
    return reply
      .status(400)
      .send({ field: 'email', info: 'User does not exist' });
  }

  const user = await User.findOne({ where: { email } });

  if (!(await compare(password, user.password))) {
    return reply
      .status(400)
      .send({ field: 'password', info: 'Password is not correct' });
  }

  const payload = {
    email,
    id: user.id,
  };
  const token = await sign(payload, SECRET_KEY, {
    expiresIn: '24h',
  });

  reply.send({ token });
});

export default fastify;

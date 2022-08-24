import Fastify from 'fastify';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { nanoid } from 'nanoid';

import User from './models/User.mjs';
import { isUserExist } from './utils/user.mjs';
import Link from './models/Link.mjs';

const { sign, verify } = jwt;

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

fastify.get('/hash/:hash', async (request, reply) => {
  const { hash } = request.params;
  const link = await Link.findOne({ where: { hash } });
  if (!link) return reply.status(400).send('error');

  reply.send({ link: link.link });
});

fastify.register((instance, opts, done) => {
  instance.addHook('onRequest', async (request, reply) => {
    const { token } = request.headers;

    try {
      const { id } = await verify(token, SECRET_KEY);

      request.id = id;
    } catch (err) {
      return reply.status(401).send({ info: err.message });
    }
  });

  instance.get('/links', async (request, reply) => {
    const links = await Link.findAll({ where: { userId: request.id } });

    reply.send(links);
  });

  instance.post('/links', async (request, reply) => {
    const {
      id,
      body: { link },
    } = request;

    const userLink = new Link();

    userLink.userId = id;
    userLink.hash = nanoid(10);
    userLink.link = link;

    await userLink.save();

    reply.send(userLink);
  });

  done();
});

export default fastify;

import User from '../models/User.mjs';

export async function isUserExist(email) {
  return !!(await User.findOne({ where: { email } }));
}

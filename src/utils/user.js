import User from '../models/User';

export async function isUserExist(email) {
  return !!(await User.findOne({ where: { email } }));
}

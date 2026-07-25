import bcrypt from 'bcrypt';
import { Admin } from '../models/Admin.js';
import { env } from '../config/env.js';

export const seedAdmin = async (): Promise<void> => {
  const existingAdmin = await Admin.findOne({ username: env.adminUsername });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(env.adminPassword, 12);
    await Admin.create({
      username: env.adminUsername,
      password: hashedPassword,
    });
    console.log('Default admin account created');
  }
};

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.js';

const seedDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log(`MongoDB Connected: ${mongoose.connection.host}`);

    const existingAdmin = await Admin.findOne({ username: env.adminUsername });

    if (existingAdmin) {
      console.log('Admin user already exists. Seeding skipped.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(env.adminPassword, salt);

    await Admin.create({
      username: env.adminUsername,
      password: hashedPassword,
    });

    console.log('Admin user created successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

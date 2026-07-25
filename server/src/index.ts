import app from './app.js';
import { connectDB } from './config/db.js';
import { env } from './config/env.js';
import { seedAdmin } from './utils/seedAdmin.js';

const startServer = async (): Promise<void> => {
  await connectDB();
  await seedAdmin();

  app.listen(env.port, () => {
    console.log(`Server running on port ${env.port}`);
  });
};

startServer();

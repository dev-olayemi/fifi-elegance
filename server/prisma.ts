import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import * as path from 'path';

// Get the database URL - use absolute path for file-based SQLite
const dbUrl = process.env.DATABASE_URL || `file:${path.join(process.cwd(), 'dev.db')}`;

console.log('Database URL:', dbUrl);

// PrismaLibSql expects a config object, not a client
// For Turso (production), include authToken
const adapterConfig: any = {
  url: dbUrl,
};

// Add auth token for Turso (cloud database)
if (process.env.TURSO_AUTH_TOKEN) {
  adapterConfig.authToken = process.env.TURSO_AUTH_TOKEN;
  console.log('Using Turso with auth token');
}

const adapter = new PrismaLibSql(adapterConfig);

const prisma = new PrismaClient({
  adapter,
  log: ['error', 'warn'],
});

export default prisma;

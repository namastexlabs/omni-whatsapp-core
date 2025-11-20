import { ConfigService } from '@config/env.config';
import { Logger } from '@config/logger.config';
import { PGlite } from '@electric-sql/pglite';
import { PrismaClient } from '@prisma/client';
import { PrismaPGlite } from 'pglite-prisma-adapter';

export class Query<T> {
  where?: T;
  sort?: 'asc' | 'desc';
  page?: number;
  offset?: number;
}

export class PrismaRepository extends PrismaClient {
  pgliteDb?: PGlite;
  configService: ConfigService;
  logger: Logger;

  constructor(configService: ConfigService) {
    // Prepare PGLite adapter if needed
    const database = configService.get('DATABASE');
    const databaseProvider = database.PROVIDER;
    let pgliteDb: PGlite | undefined;

    if (databaseProvider === 'pglite') {
      const dataDir = database.PGLITE_DATA_DIR || 'memory://';
      pgliteDb = new PGlite({ dataDir });
      const adapter = new PrismaPGlite(pgliteDb);
      super({ adapter } as any);
    } else {
      super();
    }

    // Set instance properties after super()
    this.configService = configService;
    this.pgliteDb = pgliteDb;
    this.logger = new Logger('PrismaRepository');
  }

  public async onModuleInit() {
    await this.$connect();
    const database = this.configService.get('DATABASE');
    this.logger.info(`Repository:Prisma - ON (Provider: ${database.PROVIDER})`);
  }

  public async onModuleDestroy() {
    await this.$disconnect();
    if (this.pgliteDb) {
      await this.pgliteDb.close();
      this.logger.info('PGLite - Closed');
    }
    this.logger.warn('Repository:Prisma - OFF');
  }
}

import { createServer } from 'node:http';
import { connect } from './connections/mongodb';
import { getConfigService } from './services/config.service';
import { appLogger } from './services/logger.service';
import process from 'node:process';
import { app } from './app';

process.on('unhandledRejection', async (error, promise) => {
  appLogger.error((error as Error)?.message, {
    cause: 'unhandledRejection',
    name: (error as Error).name,
    stack: (error as Error).stack,
    unhandledRejection: promise,
  });

  //notify slack
});

process.on('uncaughtException', async (error) => {
  appLogger.error((error as Error)?.message, {
    cause: 'uncaughtException',
    name: (error as Error).name,
    stack: (error as Error).stack,
  });

  //notify_slack
});

async function main() {
  try {
    const { PORT, MONGO_URI } = getConfigService().getEnvVariable();
    await connect(MONGO_URI);
    // await registerConsumers(CLOUDAMPQ_URL)

    //connect to payment db

    const server = createServer(app.init());

    server.listen(PORT, () => {
      appLogger.info(`Server Started. Listening on port ${PORT}`);
    });
  } catch (error) {
    appLogger.error((error as Error).message, error);
  }
}

main();

import 'dotenv/config'
import { initDatabase, pool } from './infra/database/database';
import { LoginUseCase } from './usecase/login.usecase';
import { UsuarioPostgresRepository } from './infra/repositories/adapters/usuario-postgres.repository';
import { exit } from 'node:process';
import { MainView } from './view/main.view';

async function bootstrap() {
  await initDatabase();

  const loginUseCase = new LoginUseCase(new UsuarioPostgresRepository(pool));

  const mainView = new MainView(loginUseCase)

  await mainView.start()
}

bootstrap()
  .then(() => {
    process.exit(0)
  })
  .catch((e: unknown) => {
    console.log('UNHANDLED REJECTION')
    console.error(e)
    process.exit(1)
  })
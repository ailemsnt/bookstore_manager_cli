import { initDatabase, pool } from './infra/database/database';
import { LoginUseCase } from './usecase/login.usecase';
import { UsuarioPostgresRepository } from './infra/repositories/adapters/usuario-postgres.repository';
import { MainView } from './view/main.view';
import { AuthorView } from './view/author.view';
import { AuthorUseCase } from './usecase/author.usecase';
import { AutorPostgresRepository } from './infra/repositories/adapters/autor-postgres.repository';
import { BookUseCase } from './usecase/book.usecase';
import { LivroPostgresRepository } from './infra/repositories/adapters/livro.postgres.repository';
import { BookView } from './view/book.view';
import { ClientePostgresRepository } from './infra/repositories/adapters/cliente-postgres.repository';
import { CustomerView } from './view/customer.view';
import { CustomerUseCase } from './usecase/customer.usecase';

async function bootstrap() {
  await initDatabase();

  const loginUseCase = new LoginUseCase(new UsuarioPostgresRepository(pool));

  const authorUseCase = new AuthorUseCase(new AutorPostgresRepository(pool));
  const authorView = new AuthorView(authorUseCase);

  const bookUseCase = new BookUseCase(new LivroPostgresRepository(pool));
  const bookView = new BookView(bookUseCase);

  const customerUseCase = new CustomerUseCase(new ClientePostgresRepository(pool));
  const customerView = new CustomerView(customerUseCase);
  
  const mainView = new MainView(loginUseCase, authorView, bookView, customerView)

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
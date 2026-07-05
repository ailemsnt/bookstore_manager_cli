import 'dotenv/config'
import { initDatabase, pool } from './infra/database/database';
import { defer } from './utils/defer';

async function getUfs() {
  const poolConnection = await pool.connect();

  using _ = defer(() => {
    console.log("Releasing connection");
    poolConnection.release();
  });

  return (await poolConnection.query("SELECT * FROM uf")).rows;
}

async function main() {
  initDatabase();
  const uf = await getUfs();
  console.log(uf);
}

main();
import { serve } from '@hono/node-server'

import createApp from './lib/app.ts'
import createDbClient from './lib/db-client.ts'

const { WEBAPP_USER, WEBAPP_PASSWORD, POSTGRES_HOST, POSTGRES_DB, POSTGRES_PORT = '5432', PORT = '3000', JWT_SECRET } = process.env

const pool = createDbClient({
  user: WEBAPP_USER,
  password: WEBAPP_PASSWORD,
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT),
  database: POSTGRES_DB
})

const app = createApp({pgPool: pool, jwtSecret: JWT_SECRET!});

const server = serve({
  fetch: app.fetch,
  port: parseInt(PORT, 10)
}, ({ port }) => console.log(`Server is running on port ${port}`))

process.on('SIGINT', async () => {
  await pool.end()
  server.close()
  process.exit(0)
})
process.on('SIGTERM', async () => {
  await pool.end()
  server.close((err) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    process.exit(0)
  })
})


import { Hono } from 'hono'
import { createMiddleware } from 'hono/factory'
import { serveStatic } from '@hono/node-server/serve-static'

import createJwt from './jwt.ts'

import createBookRepository from '../repositories/book-repository.ts'
import createUserRepository from '../repositories/user-respository.ts'

import index from '../routes/index.tsx'
import login from '../routes/login.tsx'

import type { Env } from '../types.ts'
import type { Pool } from 'pg'

interface CreateAppParams {
    pgPool: Pool
    jwtSecret: string
}

const createApp = ({ pgPool, jwtSecret }: CreateAppParams) => {
    const app = new Hono<Env>()
    const bookRepo = createBookRepository(pgPool)
    const userRepo = createUserRepository(pgPool)
    const jwt = createJwt(jwtSecret)

    const middleware = createMiddleware(async (c, next) => {
        c.set("books", bookRepo)
        c.set("users", userRepo)
        c.set("jwt", jwt)
        await next()
    })

    app.use(middleware)

    app.route('/', index)
    app.route('/login', login)
    app.use('/static/*', serveStatic({root: './'}))
    return app
}

export default createApp
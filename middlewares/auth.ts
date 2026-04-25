import { createMiddleware } from 'hono/factory'
import { getCookie } from 'hono/cookie'
import type { Env } from '../types.ts'

export const requireAuth = createMiddleware<Env>(async (c, next) => {
    const token = getCookie(c, 'session')
    if (!token) return c.redirect('/login')

    const jwt = c.get('jwt')
    const payload = await jwt.verifyToken(token)
    if (!payload) return c.redirect('/login')

    c.set('user', payload)
    await next()
})

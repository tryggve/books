import { Hono } from 'hono'
import { setCookie } from 'hono/cookie'
import { safeParse, z } from 'zod'

import { verifyPassword } from '../lib/password.ts'
import { setFlash, getFlash, type LoginErrorFlash } from '../lib/flash.ts'

import Login from '../views/login.tsx'

import type { Env } from '../types.ts'

const LoginRequestSchema = z.object({
    username: z.string().min(1),
    password: z.string().min(1)
})

const login = new Hono<Env>()

login.get('/', (c) => {
    const { error, username } = getFlash<LoginErrorFlash>(c)
    return c.html(<Login error={error} username={username}/>)
})

login.post('/', async (c) => {
    const stuff = await c.req.formData()
    const { success, data, error } = safeParse(LoginRequestSchema, Object.fromEntries(stuff.entries()))
    if (!success && !data) {
        console.log(error)
        setFlash<LoginErrorFlash>(c, { error: 'Något gick fel' })
        return c.redirect('/login')
    }
    const { username, password } = data
    const user = await c.get('users').findByUsername(username)

    const dummyHash = `${'00'.repeat(16)}:${'00'.repeat(64)}`
    const passwordMatch = user
        ? await verifyPassword(password, user.password)
        : await verifyPassword(password, dummyHash)

    if (!user || !passwordMatch) {
        setFlash<LoginErrorFlash>(c, { error: 'Ogiltligt användarnamn eller lösenord', username })
        return c.redirect('/login')
    }

    const token = await c.get('jwt').signToken({
        userId: user.id,
        username: user.username
    })

    setCookie(c, 'session', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'Lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    })

    return c.redirect('/')
})

export default login
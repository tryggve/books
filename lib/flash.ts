import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import type { Context } from 'hono'

export type LoginErrorFlash = {
    error?: string
    username?: string
}

export type MessageFlash = {
    message?: string
}

export function setFlash<T>(c: Context, flash: T) {
    setCookie(c, 'flash', JSON.stringify(flash), {
        httpOnly: true,
        sameSite: 'Lax',
        maxAge: 60,
    })
}

export function getFlash<T>(c: Context): T {
    const cookie = getCookie(c, 'flash')
    if (!cookie) return {} as T
    deleteCookie(c, 'flash')
    return JSON.parse(cookie) as T
}

import { sign, verify } from 'hono/jwt'

type JwtPayload = {
    userId: number
    username: string
}

const createJwt = (secret: string) => {
    return {
        signToken: (payload: JwtPayload) => {
            const today = new Date()
            const inSevenDays = today.getDate() + 7
            return sign({
                exp: Math.floor(today.setDate(inSevenDays) / 1000),
                iat: Math.floor(Date.now() / 1000),
                ...payload
            }, secret, 'HS256')
        },
        verifyToken: async (token: string): Promise<JwtPayload | null> => {
            try {
                const payload = await verify(token, secret, 'HS256')
                return payload as JwtPayload
            } catch (e) {
                console.log(e)
                return null
            }
        }
    }    
}

export type Jwt = ReturnType<typeof createJwt>
export default createJwt
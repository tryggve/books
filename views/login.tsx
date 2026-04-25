import type { FC } from 'hono/jsx'
import { css } from 'hono/css'
import Layout from './layout.tsx'

type Props = { error?: string, username?: string }

const body = css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    line-height: 1.6;
`
const container = css`width: 100%; max-width: 420px;`
const focusBorder = css`
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--color-border-info), var(--color-border-success));
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    transform: translateX(-50%);
    border-radius: 2px;
`
const wrapper = css`
    margin-bottom: 24px;
    position: relative;
    display: flex;
    flex-direction: column;
    input {
        background: var(--color-background-tertiary);
        border: 1px solid var(--color-background-secondary);
        border-radius: 12px;
        padding: 30px 16px 8px 16px;
        color: var(--color-text-primary);
        font-size: 16px;
        font-weight: 400;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        width: 100%;
        outline: none;
        backdrop-filter: blur(10px);
        &::placeholder {
           color: transparent;
        }
        &:focus, &:valid {
            border-color: var(--color-border-primary);
            background: var(--color-background-primary);
            transform: translateY(-2px);
        }
        &:focus + label, &:valid + label {
            transform: translateY(-8px) scale(0.85);
            color: var(--color-text-tertiary);
            font-weight: 500;
        }
        &:focus ~ ${focusBorder} {
           width: 100%;
        }
    }
    label {
        position: absolute;
        left: 16px;
        top: 16px;
        color: var(--color-text-tertiary);
        font-size: 16px;
        font-weight: 400;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        pointer-events: none;
        transform-origin: left top;
    }
`

const btn = css`
    background: linear-gradient(135deg, var(--color-background-primary) 0%, var(--color-background-secondary) 100%);
    border: none;
    border-radius: 12px;
    padding: 16px 24px;
    color: var(--color-text-primary);
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    position: relative;
    overflow: hidden;
    &:hover {
       background: linear-gradient(135deg, var(--color-background-tertiary) 0%, var(--color-background-secondary) 100%)
    }
`

const loginBtn = css`
    ${btn};
    width: 100%;
    margin-bottom: 24px;
`

const errorMessage = css`
    color: var(--color-text-danger);
    padding: 16px 8px;
`

const Login: FC<Props> = ({ error, username }) => (
    <Layout title="Login" bodyStyle={body}>
        <div class={container}>
            <form class="login-form" method="post" action="/login">
                {error && <p class={errorMessage}>{error}</p>}
                <div class={wrapper}>
                    <input type="text" id="username" name="username" value={username} placeholder="Username" required autocomplete="username" />
                    <label for="username">Username</label>
                    <span class={focusBorder}></span>
                </div>
                <div class={wrapper}>
                    <input type="password" id="password" name="password" placeholder="Password" required autocomplete="current-password" />
                    <label for="password">Password</label>
                    <span class={focusBorder}></span>
                </div>
                <button type="submit" class={loginBtn}>Sign In</button>
            </form>
        </div>
    </Layout>
)

export default Login

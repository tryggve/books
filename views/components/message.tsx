import { css } from "hono/css"
import type { FC, PropsWithChildren } from "hono/jsx"

const style = css`
    color: var(--color-text-info);
    background-color: var(--color-background-info);
`

const Message: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div class={style}>
            {children}
        </div>
    )
}

export default Message
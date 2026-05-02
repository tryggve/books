import { css } from "hono/css"
import type { FC, PropsWithChildren } from "hono/jsx"

const style = css`
    position: fixed;
    top: -100px;
    left: 20px;
    right: 20px;
    z-index: 9999;
    color: var(--color-text-info);
    background-color: var(--color-background-info);
    padding: 20px 30px;
    border-radius: 8px;
    text-align: center;
    transition: opacity ease-out 300ms, top ease 600ms;
    &.show {
        top: 100px;
    }
    &.hide {
        top: -100px;
        opacity: 0;
    }
`

const Message: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div id='message' class={style}>
            {children}
        </div>
    )
}

export default Message
import { css } from "hono/css"
import type { FC } from "hono/jsx"

type Props = {
    commandfor: string
}

const style = css`
    border: none;
    background-color: transparent;
    margin: 5px;
    padding: 12px;
    border-radius: 20px;
    cursor: pointer;
    &:hover {
        background-color: var(--color-background-secondary);
    }
`

const CloseButton: FC<Props> = ({ commandfor }) => (
    <button commandfor={commandfor} command="close" class={style}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18" />
            <path d="M6 6l12 12" />
        </svg>
    </button>
)

export default CloseButton
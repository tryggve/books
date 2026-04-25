import type { FC } from "hono/jsx"
import { css } from "hono/css"

const tools = css`display: flex; gap: 8px; flex-wrap: wrap;`
const btn = css`font-size: 12px; padding: 8px 16px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer;`

export const Tools: FC = () => {
    return (
        <div class={tools}>
                <button class={btn} command="show-modal" commandfor="add-form">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 5v14" />
                    <path d="M5 12h14" />
                </svg>
            </button>
        </div>
    )
}
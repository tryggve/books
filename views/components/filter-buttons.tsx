import type { FC } from 'hono/jsx'
import { css } from 'hono/css'

const bar = css`display: flex; gap: 8px; flex-wrap: wrap;`
const btn = css`font-size: 12px; padding: 8px 16px; min-width: 93px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; transition: background 0.15s, color 0.15s;`
const btnActive = css`background: var(--color-background-info); color: var(--color-text-primary); border-color: var(--color-border-primary);`
const readStatusBtnActive = css`background: var(--color-background-success);`

const FilterButtons: FC = () => {
    return (
        <div id='filter_buttons' class={bar}>
            <button id='read-status' data-state="all" class={btn} data-class-active={readStatusBtnActive}>Läst | Oläst</button>
            <button id='owned-status' data-state="all" class={btn} data-class-active={btnActive}>Ägarskap</button>
        </div>
    )
}

export default FilterButtons
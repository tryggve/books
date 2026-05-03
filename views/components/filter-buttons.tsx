import type { FC } from 'hono/jsx'
import { css } from 'hono/css'

const bar = css`display: flex; gap: 8px;`
const btn = css`
    font-size: 12px;
    padding: 8px 16px;
    min-width: 101px;
    border-radius: 8px;
    border: 0.5px solid var(--color-border-secondary);
    background: transparent;
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
    &[data-active] {
        background: var(--color-background-info);
        color: var(--color-text-primary);
        border-color: var(--color-border-primary);
    }
`

const readBtn = css`
    ${btn};
    &[data-active] {
        background: var(--color-background-success);
    }
`

const FilterButtons: FC = () => {
    return (
        <div id='filter_buttons' class={bar}>
            <button id='read-status' data-state="all" class={readBtn}>Läst | Oläst</button>
            <button id='owned-status' data-state="all" class={btn}>Har | Saknar</button>
        </div>
    )
}

export default FilterButtons
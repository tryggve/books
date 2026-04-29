import { css } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'

const seriesRow = css`
    display: flex;
    align-items: center;
    position: sticky;
    top: 132px;
    background-color: var(--color-background-primary);
    gap: 16px;
    padding: 8px 28px;
    cursor: pointer;
    user-select: none;
    &::before {
        content: "";
        position: absolute;
        left: 16px;
        display: inline-block;
        border-right: 1px solid var(--color-text-tertiary);
        border-bottom: 1px solid var(--color-text-tertiary);
        width: 4px;
        height: 4px;
        transform: rotate(-45deg);
        transition: transform 0.2s;
    }
`
const seriesBlock = css`
    margin-bottom: 8px;
//    padding: 0 8px 0 16px;
    &:last-child {
        margin-bottom: 0px;
    }

    &[open] > ${seriesRow} {
        &::before {
            transform: rotate(45deg);
        }
    }
`
const seriesName = css`font-size: 13px; font-weight: 500; color: var(--color-text-secondary); flex: 1;`
const seriesCount = css`font-size: 11px; color: var(--color-text-tertiary);`
const seriesChevron = css`width: 12px; height: 12px; transition: transform 0.2s; color: var(--color-text-tertiary); &[data-open] { transform: rotate(90deg); }`
const seriesChildren = css`display: none; &[data-open] { display: block; }`

export const SeriesBlock: FC<PropsWithChildren<{ name: string, count: number }>> = ({ name, count, children }) => {
    if (count === 0) return null
    return (
        <details class={seriesBlock} open>
            <summary class={seriesRow} data-component='series-row'>
                <span class={seriesName}>{name}</span>
                <span class={seriesCount}>{count} {count !== 1 ? 'böcker' : 'bok'}</span>
            </summary>
            {children}
        </details>
    )
}

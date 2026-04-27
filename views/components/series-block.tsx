import { css } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'

const seriesBlock = css`margin-bottom: 8px; padding: 0 8px 0 16px; &:last-child { margin-bottom: 0px; }`
const seriesRow = css`position: sticky; top: 110px; display: flex; align-items: center; background-color: var(--color-background-primary); gap: 16px; padding: 8px 0; cursor: pointer; user-select: none;`
const seriesName = css`font-size: 13px; font-weight: 500; color: var(--color-text-secondary); flex: 1;`
const seriesCount = css`font-size: 11px; color: var(--color-text-tertiary);`
const seriesChevron = css`width: 12px; height: 12px; transition: transform 0.2s; color: var(--color-text-tertiary); &[data-open] { transform: rotate(90deg); }`
const seriesChildren = css`display: none; &[data-open] { display: block; }`

export const SeriesBlock: FC<PropsWithChildren<{ name: string, count: number }>> = ({ name, count, children }) => {
    if (count === 0) return null
    return (
        <div class={seriesBlock}>
            <div class={seriesRow} data-component='series-row'>
                <svg class={seriesChevron} data-open viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="5,3 9,7 5,11" /></svg>
                <span class={seriesName}>{name}</span>
                <span class={seriesCount}>{count} {count !== 1 ? 'böcker' : 'bok'}</span>
            </div>
            <div class={seriesChildren} data-open>
                {children}
            </div>
        </div>
    )
}

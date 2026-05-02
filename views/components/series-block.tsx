import { css } from 'hono/css'
import type { FC, PropsWithChildren } from 'hono/jsx'

const seriesRow = css`
    display: flex;
    align-items: center;
    position: sticky;
    top: 132px;
    background-color: var(--color-background-primary);
    gap: 16px;
    padding: 8px 8px 8px 44px;
    cursor: pointer;
    user-select: none;
    &::before {
        content: "";
        position: absolute;
        left: 16px;
        display: inline-block;
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none' stroke='currentColor' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='5,3 9,7 5,11' /%3E%3C/svg%3E");
        background-repeat: no-repeat;
        width: 14px;
        height: 14px;
        transform: rotate(0deg);
        transition: transform 0.2s;
    }
`
const seriesBlock = css`
    margin-bottom: 8px;
    &:last-child {
        margin-bottom: 0px;
    }

    &[open] > ${seriesRow} {
        &::before {
            transform: rotate(90deg);
        }
    }
`
const seriesName = css`font-size: 13px; font-weight: 500; color: var(--color-text-secondary); flex: 1;`
const seriesCount = css`font-size: 11px; color: var(--color-text-tertiary);`

export const SeriesBlock: FC<PropsWithChildren<{ name: string, count: number, seriesId: string }>> = ({ name, count, children, seriesId }) => {
    if (count === 0) return null
    return (
        <details class={seriesBlock} open data-component='series-block' data-series-id={seriesId}>
            <summary class={seriesRow} data-component='series-row'>
                <span class={seriesName}>{name}</span>
                <span class={seriesCount}>{count} {count !== 1 ? 'böcker' : 'bok'}</span>
            </summary>
            {children}
        </details>
    )
}

import { useContext } from 'hono/jsx'
import type { FC, PropsWithChildren } from "hono/jsx"
import { css } from "hono/css"

import { RepoContext } from '../../routes/index.tsx'

const container = css`padding: 20px; width: 100%; min-height: 400px;`
const header = css`display: flex; justify-content: space-between; align-items: center;`
const bookForm = css`display: flex; flex-direction: column; gap: 1rem;`
const label = css`display: block; font-size: 13px; color: var(--color-text-secondary); margin-bottom: 4px;`
const inputSelect = css`padding: 10px 5px; width: 100%; border: 1px solid var(--color-border-secondary); border-radius: 8px;`
const seriesWrapper = css`display: grid; grid-template-columns: 3fr 1fr; gap: 12px;`
const checkboxWrapper = css`border-top: 0.5px solid var(--color-border-secondary); padding-top: 1rem; display: flex; gap: 1.5rem;`
const checkboxLabel = css`display: flex; align-items: center; gap: 8px; font-size: 14px; color: var(--color-text-primary); cursor: pointer;`
const formSubmitWrapper = css`display: flex; gap: 8px; padding-top: 0.5rem;`
const button = css`font-size: 12px; padding: 8px 16px; border-radius: 8px; border: 0.5px solid var(--color-border-secondary); background: transparent; color: var(--color-text-secondary); cursor: pointer; &:hover {background-color: var(--color-background-tertiary);}`
const submitButton = css`${button}; flex: 1;`

const BookForm: FC<PropsWithChildren<{closeButton: any}>> = ({closeButton}) => {
    const { authors, series } = useContext(RepoContext)

    return (
        <div class={container}>
            <div class={header}>
                <h2>Lägg till bok</h2>
                {closeButton}
            </div>
            <form id="book-form" method="post" action="/books" class={bookForm}>
                <div>
                    <label for="book-title" class={label}>Titel</label>
                    <input type="text" name="title" id="book-title" class={inputSelect} placeholder="Boktitel" required autofocus />
                </div>
                <div>
                    <label for="book-author" class={label}>Författare</label>
                    <select name="author" id="book-author" class={inputSelect} required>
                        <option value="">Välj</option>
                        { authors.map((a) => (<option value={a.id}>{a.name}</option>)) }
                    </select>
                </div>
                <div class={seriesWrapper}>
                    <div>
                        <label for="book-series" class={label}>Bokserie</label>
                        <select name="series" id="book-series" class={inputSelect}>
                            <option value="">Ingen serie</option>
                            { series.map((s) => (<option value={s.id} data-author-id={s.primaryAuthorId} data-next-part={s.nextPart}>{s.name}</option>)) }
                        </select>
                    </div>
                    <div>
                        <label for="series-order" class={label}>Del</label>
                        <input type="number" name="order" id="series-order" class={inputSelect} placeholder="" min="0" oninput="validity.valid||(value='');" disabled />
                    </div>
                </div>
                <div>
                    <label for="year-published" class={label}>Utgivningsår</label>
                    <input type="number" name="year" id="year-published" class={inputSelect} placeholder="" min="0" oninput="validity.valid||(value='');" />
                </div>
                <div class={checkboxWrapper}>
                    <label for="read-check" class={checkboxLabel}>
                        <input type="checkbox" name="read" id="read-check" class={inputSelect} value="true" /> Läst
                    </label>
                    <label for="owned-check" class={checkboxLabel}>
                        <input type="checkbox" name="owned" id="owned-check" class={inputSelect} value="true" /> Äger
                    </label>
                </div>
                <div class={formSubmitWrapper}>
                    <button type="submit" class={submitButton}>Lägg till bok</button>
                    <button type="button" class={button} commandfor="add-form" command="close">Avbryt</button>
                </div>
            </form>
        </div>
    )
}

export default BookForm
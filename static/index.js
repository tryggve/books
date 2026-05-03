const labelMaker = {
    owned: ['Har | Saknar', 'Har', 'Saknar'],
    read: ['Läst | Oläst', 'Läst', 'Inte läst']
}

const stateMachine = {
    owned: ['all', 'owned', 'not-owned'],
    read: ['all', 'read', 'not-read']
}

currentState = {
    owned: undefined,
    read: undefined
}

function enableClicker(node) {
    const buttonActiveClass = node.dataset.classActive;
    const filterType = node.id.split('-').shift();
    currentState[filterType] = node.dataset.state;
    node.addEventListener('click', () => {
        const nextState = (stateMachine[filterType].indexOf(node.dataset.state) + 1) % stateMachine[filterType].length
        node.textContent = labelMaker[filterType][nextState]
        currentState[filterType] = node.dataset.state = stateMachine[filterType][nextState]
        if (nextState > 0) { node.dataset.active = true } else delete node.dataset.active
        filterBooks()
    })
}

function filterBooks() {
    const bookNodes = document.querySelectorAll('[data-component="book-row"]')
    bookNodes.forEach(book => {
        const ownedMatch = currentState.owned === 'all'
            || (currentState.owned === 'owned' && book.dataset.owned === 'true')
            || (currentState.owned === 'not-owned' && book.dataset.owned === 'false')
        const readMatch = currentState.read === 'all'
            || (currentState.read === 'read' && book.dataset.read === 'true')
            || (currentState.read === 'not-read' && book.dataset.read === 'false')

        if (ownedMatch && readMatch) return book.style.display = 'flex';

        return book.style.display = 'none'
    })
}

function enableSeriesFilter(newSeriesInput, bookAuthorSelector, seriesSelector, seriesOptions, seriesOrderInput) {
    bookAuthorSelector.addEventListener('change', () => {
        seriesSelector.value = ''
        if (newSeriesInput.value === '') {
            seriesOrderInput.disabled = true
            seriesOrderInput.value = null
        }
        seriesOptions.forEach(o => o.hidden = o.dataset.authorId !== bookAuthorSelector.value)
    })

}

function enableSeriesOrderEnabler(seriesOrderInput, newSeriesInput, seriesSelector, seriesOptions) {
    const stuff = Array.from(seriesOptions)
    newSeriesInput.addEventListener('change', () => {
        seriesOrderInput.disabled = newSeriesInput.value === ''
        seriesOrderInput.value = 1
    })
    seriesSelector.addEventListener('change', () => {
        seriesOrderInput.disabled = seriesSelector.value === ''
        seriesOrderInput.value = stuff.find(so => so.value === seriesSelector.value)?.dataset.nextPart || null
    })
}

function enableObserver(sentinel, toolbar) {
    const observer = new IntersectionObserver(([e]) => { toolbar.toggleAttribute('data-stuck', !e.isIntersecting) })
    observer.observe(sentinel)
}

function enableSwitcharoo(button, input, selector) {
    button.addEventListener('click', () => {
        input.toggleAttribute('data-show')
        input.toggleAttribute('required')
        selector.id === 'book-author' && selector.toggleAttribute('required')
        const showSelector = selector.toggleAttribute('data-show')
        if (showSelector) {
            input.value = ''
            button.textContent = 'Ny'
            selector.focus()
        } else {
            selector.value = ''
            button.textContent = 'Välj'
            input.focus()
        }
    })
}

function killTheMessenger(message) {
    if (!message) return;
    window.setTimeout(() => {
        message.classList.add('show')
    })
    window.setTimeout(() => {
        message.classList.add('hide')
    }, 2000)
    window.setTimeout(() => {
        message.remove()
    }, 3000)
}

function hello() {
    const toolbar = document.querySelector('[data-component="toolbar"]')
    const sentinel = document.querySelector('[data-component="sentinel"]')

    const authorNodes = document.querySelectorAll('[data-component="author-block"]')
    const seriesNodes = document.querySelectorAll('[data-component="series-block"]')

    const bookForm = document.querySelector('#book-form')
    const editBookForm = document.querySelectorAll('[data-component="edit-book-form"]')
    const bookAuthorSelector = document.querySelector('#book-author')
    const seriesSelector = document.querySelector('#book-series')
    const seriesOrderInput = document.querySelector('#series-order')
    const seriesOptions = document.querySelectorAll('#book-series option[data-author-id]')
    const newAuthorInput = document.querySelector('#new-author-input')
    const newSeriesInput = document.querySelector('#new-series-input')
    const newAuthorButton = document.querySelector('#new-author-button')
    const newSeriesButton = document.querySelector('#new-series-button')
    const message = document.querySelector('#message')

    bookForm.addEventListener('submit', () => setPageState(authorNodes, seriesNodes))
    editBookForm.forEach(node => node.addEventListener('submit', () => setPageState(authorNodes, seriesNodes)))
    document.querySelectorAll('#owned-status, #read-status').forEach(enableClicker)
    enableSeriesFilter(newSeriesInput, bookAuthorSelector, seriesSelector, seriesOptions, seriesOrderInput)
    enableSeriesOrderEnabler(seriesOrderInput, newSeriesInput, seriesSelector, seriesOptions)
    enableObserver(sentinel, toolbar);
    enableSwitcharoo(newAuthorButton, newAuthorInput, bookAuthorSelector)
    enableSwitcharoo(newSeriesButton, newSeriesInput, seriesSelector)
    killTheMessenger(message)
}

function setPageState(authorNodes, seriesNodes) {
    const openAuthors = [...authorNodes].filter(n => n.open).map(n => n.dataset.authorId)
    const notOpenSeries = [...seriesNodes].filter(n => !n.open).map(n => n.dataset.seriesId)
    sessionStorage.setItem('pageState', JSON.stringify({
        openAuthors,
        notOpenSeries,
        scrollY: window.scrollY,
    }))
}

function restorePageState() {
    const state = sessionStorage.getItem('pageState')
    if (!state) return;

    const { openAuthors, notOpenSeries, scrollY } = JSON.parse(state)

    openAuthors.forEach(id => {
        const el = document.querySelector(`[data-component="author-block"][data-author-id="${id}"]`)
        if (el) el.open = true
    })
    notOpenSeries.forEach(id => {
        const el = document.querySelector(`[data-component="series-block"][data-series-id="${id}"]`)
        if (el) el.removeAttribute('open')
    })

    if (scrollY) {
        window.scrollTo({ top: parseInt(scrollY), behavior: 'instant' })
    }

    sessionStorage.removeItem('pageState')
}

window.addEventListener('DOMContentLoaded', restorePageState)
window.addEventListener('DOMContentLoaded', hello)

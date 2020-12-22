// преобразование валюты
const toCurrency = price => {
    return new Intl.NumberFormat('ca-CA', {
        currency: 'CAD',
        style: 'currency'
    }).format(price)
}

// преобразование даты
const toDate = date => {
    return new Intl.DateTimeFormat('ru-Ru', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    }).format(new Date(date))
}

document.querySelectorAll('.price').forEach(el => {
    el.textContent = toCurrency(el.textContent)
})
document.querySelectorAll('.date').forEach(el => {
    el.textContent = toDate(el.textContent)
})


const $card = document.querySelector('#card')
    if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/cart/remove/' + id, {
                method: 'delete',
            }).then((res) => res.json())
                .then(card => {
                    if (card.courses.length) {
                        const html = card.courses.map(el => {
                            return `
                                 <tr>
                                    <td>${el.title}</td>
                                    <td>${el.count}</td>
                                    <td>
                                        <button class="btn btn-small js-remove" data-id="${el.id}">Remove course</button>
                                    </td>
                                 </tr>
                            `
                        }).join('')
                        $card.querySelector('tbody').innerHTML = html
                        $card.querySelector('.price').textContent = toCurrency(card.price)
                    }else{
                        $card.innerHTML = "Card is empty"
                    }
                })
        }
    })
}

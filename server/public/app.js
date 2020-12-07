
const toCurrency = price => {
    return new Intl.NumberFormat('ca-CA', {
        currency: 'CAD',
        style: 'currency'
    }).format(price)
}

document.querySelectorAll('.price').forEach(el => {
    el.textContent = toCurrency(el.textContent)
})


const $card = document.querySelector('#card')
if ($card) {
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')) {
            const id = event.target.dataset.id

            fetch('/card/remove/' + id, {
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
            console.log(id)
        }
    })
}

document.querySelectorAll('.price').forEach(el => {
  el.textContent = new Intl.NumberFormat('ca-CA', {
      currency: 'CAD',
      style: 'currency'
  }).format(el.textContent)
})


const $card = document.querySelector('#card')
if ($card){
    $card.addEventListener('click', event => {
        if (event.target.classList.contains('js-remove')){
            const id = event.target.dataset.id

            fetch('/card/remove/'+id, {
                method: 'delete',
            }).then((res) => res.json())
                .then(data => console.log(data))

            console.log(id)
        }
    })
}

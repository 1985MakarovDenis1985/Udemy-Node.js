document.querySelectorAll('.price').forEach(el => {
  el.textContent = new Intl.NumberFormat('ca-CA', {
      currency: 'CAD',
      style: 'currency'
  }).format(el.textContent)
})
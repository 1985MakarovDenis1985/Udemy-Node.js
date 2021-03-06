
// --- helpers шаблон для hbs --- //
module.exports = {
    ifeq(a, b, options) {
        if (a == b) {  // --- двойное равенство --- //
            return options.fn(this)
        } else {
            return options.inverse(this)
        }
    }
}
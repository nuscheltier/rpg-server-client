/**
 * dice.js
 * Just the dice throwing.
 */

function dice(side, number) {
    number = number || 1
    let result = {sides: side, numbers: number, results: []}
    for(let i = 0; i < number; i++) {
        let x = Math.floor(Math.random() * 1000)
        result.results.push((x % side) + 1)
    }
    return result
}

module.exports = dice;
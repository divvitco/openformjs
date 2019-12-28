// const fill = require('./fill')
// const parse = require('./fill')
// const render = require('./fill')
//
// module.exports = {
//   fill,
//   parse,
//   render
// }


const openform = require('./index')

test('exports a fill method', () => {
  expect(openform.fill instanceof Function).toBe(true)
})

test('exports a render method', () => {
  expect(openform.render instanceof Function).toBe(true)
})

test('exports a validate method', () => {
  expect(openform.validate instanceof Function).toBe(true)
})

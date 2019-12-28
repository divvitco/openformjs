const openform = require('./index')

test('exports a fill method', () => {
  expect(openform.fill instanceof Function).toBe(true)
})

test('exports a render method', () => {
  expect(openform.render instanceof Function).toBe(true)
})

test('exports a parse method', () => {
  expect(openform.parse instanceof Function).toBe(true)
})

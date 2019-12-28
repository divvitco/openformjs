const openform = require('./index')
const template = require('./1099.json')

const info = {
  payer_info: 'Some Company Inc <br/>100 Awesome St. <br/>St. Louis, MO 00110',
  payer_tin: '01-0000001',
  recipient_tin: '001-01-0001',
  recipient_name: 'John Doe',
  recipient_address_street: '800 Example St',
  recipient_address_city_zip_state: 'Some City, MO 00001',
  other_income: '2500'
}

const filled = openform.fill(template, info)
const pdf = openform.render(filled, { type: 'pdf' })

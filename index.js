const builder = require('xmlbuilder')
const fs = require('fs')

const template = require('./1099.json')

// utility to convert objects to CSS key-value pairs (the empty string adds a semicolon to the end of the list via join)
const objToCss = obj => Object.keys(obj).map(key => `${key}: ${obj[key]}`).join(';')

const containerStyle = ({ width: pWidth, height: pHeight }, { width: gWidth, height: gHeight }) => (`
  font-family: sans-serif;
  margin: 0 auto;
  width: ${gWidth || pWidth}px;
  height: ${gHeight || pHeight}px;
  display: grid;
  grid-template-columns: repeat(${Math.floor((gWidth || pWidth)/10)}, 10px [col-start]);
  grid-template-rows: repeat(${Math.floor((gHeight || pHeight)/10)}, 10px [row-start]);
`)

const boxStyle = ([x, y, width, height], boxStyle = {}) => (
  `border: 1px solid black; grid-column: ${x} / span ${width}; grid-row: ${y} / span ${height};${objToCss(boxStyle)};`
)

const labelStyle = () => (`
  font-size: 11px;
  margin: 4px 6px;
`)

const prefixStyle = () => (`
  font-weight: 800;
`)

const valueStyle = () => (`
  font-size: 14px;
  margin: 4px;
  color: red;
`)

const parseTemplate = template => {
  let result = {}

  const parsePage = page => {
    return {
      settings: page.settings,
      grid: page.grid,
      elements: parseElements(page.elements)
    }
  }

  const parseElements = elements => {
    const elCopy = [...elements]

    elCopy.forEach((el, i) => {
      const currLoc = el.location

      // handle bad template form
      if (i === 0 && currLoc.length !== 4) throw new Error('Location placement shorthand can only be used after a previously positioned element')

      // utility func to compute the location of a shorthand element
      const computeLoc = () => {
        const prevLoc = elCopy[i - 1].location

        // computes an x-hold and y-change position (nested arrays create the inverse)
        return [prevLoc[0], prevLoc[1] + prevLoc[3], currLoc[0], currLoc[1]]
      }

      // get the actual location
      const location = currLoc.length === 4 ? currLoc : computeLoc()

      // set the element with an updated location
      elCopy[i] = {
        ...el,
        location
      }
    })

    return elCopy
  }

  return {
    schema: {
      pages: template.schema.pages.map(parsePage)
    }
  }
}


const renderTemplate = parsed => {
  return parsed.schema.pages.map(p => {
    const doc = builder.create('html', { encoding: 'utf-8', headless: true })
    // TODO -- don't rely on network-bound external scripts -- read the reset and inject in the head of the output
    doc.ele('head').ele('link').att('rel', 'stylesheet').att('href', 'https://cdnjs.cloudflare.com/ajax/libs/meyer-reset/2.0/reset.min.css')

    const body = doc.ele('body').ele('div').att('style', containerStyle(p.settings, p.grid))

    p.elements.forEach(el => {
      const box = body.ele('div').att('style', boxStyle(el.location, el.boxStyle))

      if (el.description || el.prefix) {
        let desc = box.ele('div').att('style', labelStyle())
        if (el.prefix) desc.ele('span', el.prefix).att('style', prefixStyle())
        desc.ele('span', el.description).up()
      } else {
        box.ele('span').up()
      }
      if (el.value) box.ele('div').raw(el.value).att('style', valueStyle()).up()
    })

    return doc.end({ pretty: true })
  })
}

const parsed = parseTemplate(template)
const pages = renderTemplate(parsed)

// TODO -- stop assuming there is only one page
const data = new Uint8Array(Buffer.from(pages[0]))
fs.writeFile('1099.html', data, (err) => {
  if (err) throw err
  console.log('The file has been saved!')
})

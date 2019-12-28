module.exports = (template, inputs) => {
  return {
    name,
    schema: {
      openform,
      pages: template.pages.map(p => {
        return {
          location: p.location,
          grid: p.grid,
          
        }
      })
    }
  }
}

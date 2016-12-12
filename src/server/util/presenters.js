export function table(metrics, options = {}) {
  const {includeHeaders, colDelimiter, rowDelimiter} = Object.assign({includeHeaders: false, colDelimiter: '\t', rowDelimiter: '\n'}, options)
  if (!Array.isArray(metrics) && metrics !== Object(metrics)) {
    throw new Error('table presenter only knows how to format objects and arrays of objects')
  }
  const metricsRows = Array.isArray(metrics) ? metrics : [metrics]

  const rows = []
  if (includeHeaders) {
    const keys = Object.keys(metricsRows[0])
    rows.push(keys.join(colDelimiter))
  }
  metricsRows.forEach(metrics => {
    const values = Object.keys(metrics).map(key => metrics[key])
    rows.push(values.join(colDelimiter))
  })

  return rows.join(rowDelimiter)
}

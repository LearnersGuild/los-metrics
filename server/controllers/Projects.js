import path from 'path'
import fs from 'fs'

export function getMetrics(req, res) {
  try {
    // de-serialize and re-serialize to ensure the data is correct
    const dataFile = path.join(__dirname, '..', '..', 'data', 'projects.json')
    const fileContents = fs.readFileSync(dataFile)
    const projects = JSON.parse(fileContents)
    res.status(200).json(projects)
  } catch (err) {
    console.error(err)
    res.status(500).json({code: 500, message: "Couldn't read projects data."})
  }
}

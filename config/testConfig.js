import jsdom from 'jsdom'

const doc = jsdom.jsdom('<!doctype html><html><body></body></html>')
const win = doc.defaultView
global.__CLIENT__ = false
global.document = doc
global.window = win
global.navigator = global.window.navigator

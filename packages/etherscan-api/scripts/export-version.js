const pkg = require('../package.json')
const fs = require('fs')
const text = `export const VERSION: string = '${pkg.version}'
`
fs.writeFileSync('./src/version.ts', text, 'utf-8')
console.log(`Version written to version.ts ${pkg.version}`)
const path = require('path')
const { request } = require('undici')
const fs = require('fs-extra')
const lzString = require('lz-string')

const questionsDir = path.join(process.cwd(), 'resources', 'questions')
const helperFileName = 'type-challenges-utils.ts'


;(async function () {
  const dirs = await fs.readdir(questionsDir)


  for (const dir of dirs) {
    const idx = dir.match(/^\d+/)[0]

    const url = `https://tsch.js.org/${idx}/play`

    console.log(`Downloading ${dir}.ts from ${url}`)

    const { headers: { location = '' } } = await request(url)

    let fileContent = location.slice(location.indexOf('code/') + 5)

    fileContent = lzString.decompressFromEncodedURIComponent(fileContent) 

    fileContent = fileContent.replace(
      '@type-challenges/utils',
      `./${helperFileName.slice(0, -3)}`
    )

    const filePath = path.join(questionsDir, dir, `${dir}.ts`)

    await fs.writeFile(filePath, fileContent)
  }
})()


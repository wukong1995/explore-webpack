const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
// const babel = require('@babel/core')

const moduleAnalysis = (filePath) => {
  const str = fs.readFileSync(filePath, 'utf-8')
  const ast = parser.parse(str, {
    sourceType: 'module'
  })

  const dependencies = []

  traverse(ast, {
    ImportDeclaration(specifiers, source) {
      // console.log('arguments', specifiers, source)
    }
  })
  console.log(ast)
}


moduleAnalysis('./src/index.js')
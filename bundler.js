const fs = require('fs')
const path = require('path')
const parser = require('@babel/parser')
const traverse = require('@babel/traverse').default
const babel = require('@babel/core')

const moduleAnalysis = (filename) => {
  const str = fs.readFileSync(filename, 'utf-8')
  const ast = parser.parse(str, {
    sourceType: 'module'
  })

  // console.log('ast', ast.program)

  const dependencies = {}

  traverse(ast, {
    ImportDeclaration({ node }) {
      const basePath = path.dirname(filename)
      const absolutePath = './' + path.join(basePath, node.source.value)
      dependencies[node.source.value] = absolutePath
    }
  })

  const { code } = babel.transformFromAst(ast, null, {
    presets: ['@babel/preset-env']
  })

  return {
    filename,
    dependencies,
    code
  }
}

const bundleAnalysis = (entry) => {
  const moduleInfo = moduleAnalysis(entry)
  const graphList = [moduleInfo]

  for (let i = 0; i < graphList.length; i++) {
    const { dependencies } = graphList[i]

    Object.keys(dependencies).forEach(key => {
      graphList.push(moduleAnalysis(dependencies[key]))
    })
  }

  const graph = graphList.reduce((acc, item) => {
    const { filename, ...properties } = item
    acc[filename] = properties
    return acc
  }, {})

  return graph
}


const generateCode = (entry) => {
  const graph = bundleAnalysis(entry)

  return `
    ;(function(graph) {
      function require(module) {
        function localRequire(relativePath) {
          return require(graph[module].dependencies[relativePath])
        }
        var exports = {};
        (function(require, exports, code) {
          eval(code)
        })(localRequire, exports, graph[module].code)
        return exports
      }
      require('${entry}')
    })(${JSON.stringify(graph)})
  `
}


const code = generateCode('./src/index.js')

console.log(code)

class MyPlugin {
  constructor() {

  }

  apply(compiler) {
    this.doWidth(compiler)
  }

  doWidth(compiler) {
    compiler.hooks.afterEmit.tapPromise('MyPlugin', () => {
      console.log('afterEmit run run!!!')
      return Promise.resolve()
    })
  }
}

module.exports = MyPlugin
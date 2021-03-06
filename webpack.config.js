const nodeExternals = require('webpack-node-externals')

const path = require('path')
const pkg = require('./package.json')

function getFileName (target, mode, libraryName) {
  return `${libraryName}.${target}.js`
}

const configModule = {
  rules: [
    {
      test: /(\.jsx|\.js)$/,
      loader: 'babel-loader',
      exclude: /(node_modules|bower_components)/
    },
    {
      test: /(\.jsx|\.js)$/,
      loader: 'eslint-loader',
      exclude: /node_modules|simple-peer/
    }
  ]
}

const configResolve = {
  modules: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'src')],
  extensions: ['.json', '.js']
}

function getConfigClient (mode, libraryName) {
  return {
    mode: mode,
    optimization: {
      minimize: false
    },
    entry: [
      path.join(__dirname, '/src/index.js')
    ],

    devtool: 'source-map',
    output: {
      path: path.join(__dirname, '/lib'),
      filename: getFileName('client', mode, libraryName),
      library: 'PeerSoxClient',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },

    module: configModule,
    resolve: configResolve
  }
}

function getConfigServer (mode, libraryName) {
  return {
    target: 'node',
    mode: mode,
    optimization: {
      minimize: false
    },
    entry: [
      path.join(__dirname, '/src/server.js')
    ],

    devtool: 'source-map',
    output: {
      path: path.join(__dirname, '/lib'),
      filename: getFileName('server', mode, libraryName),
      library: 'PeerSoxServer',
      libraryTarget: 'umd',
      umdNamedDefine: true
    },

    module: configModule,
    resolve: configResolve,
    externals: [
      'ws',
      nodeExternals()
    ],
    node: {
      fs: 'empty'
    }
  }
}

module.exports = (env, argv) => {
  const libraryName = pkg.name
  const mode = argv.mode

  return [
    getConfigClient(mode, libraryName),
    getConfigServer(mode, libraryName)
  ]
}

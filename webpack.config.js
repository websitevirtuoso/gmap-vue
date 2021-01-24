const path = require('path')

const env = process.env.NODE_ENV

// eslint-disable-next-line import/no-dynamic-require -- this will change in a near future
const config = require(`./config/webpack.${env}.config`)

/**
 * Web config uses a global Vue and Lodash object.
 * */
const webConfig = {
  ...config,
  externals: {
    vue: 'Vue',
    '@google/markerclustererplus': 'MarkerClusterer'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'gmap-vue.js',
    library: ['GmapVue'],
    libraryTarget: 'umd'
  }
}

module.exports = [
  webConfig
]

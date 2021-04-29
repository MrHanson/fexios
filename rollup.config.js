import typescript from '@rollup/plugin-typescript'
import { uglify } from 'rollup-plugin-uglify'

const libraryName = 'fexios'
const version = process.env.VERSION || require('./package.json').version
const banner = 
  '/**\n' +
  ' * @preserve\n' +
  ` * @mrhanson/fexios v${version}\n` +
  ' */'

const commonConfig = {
  input: 'src/index.ts',
  plugins: [
    typescript()
  ]
}

const uglifyConfig = uglify({
  output: {
    // https://github.com/TrySound/rollup-plugin-uglify#comments
    comments: function (node, comment) {
      if (comment.type === 'comment2') {
        return /@preserve|@license|@cc_on/i.test(comment.value)
      }
      return false
    }
  }
})

export default [
  {
    ...commonConfig,
    output: {
      format: 'cjs',
      file: `dist/${libraryName}.common.js`,
      name: `${libraryName}.common`,
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      file: `dist/${libraryName}.umd.js`,
      name: `${libraryName}.umd`,
      banner
    }
  },
  {
    ...commonConfig,
    output: {
      format: 'umd',
      file: `dist/${libraryName}.umd.min.js`,
      name: `${libraryName}.umd.min`,
      banner
    },
    plugins: [
      ...commonConfig.plugins,
      uglifyConfig
    ]
  },
  {
    ...commonConfig,
    output: {
      format: 'es',
      file: `dist/${libraryName}.es.js`,
      name: `${libraryName}.es`,
      banner
    },
  },
  {
    ...commonConfig,
    output: {
      format: 'es',
      file: `dist/${libraryName}.es.min.js`,
      name: `${libraryName}.es.min`,
      banner
    },
    plugins: [
      ...commonConfig.plugins,
      uglifyConfig
    ]
  },
]

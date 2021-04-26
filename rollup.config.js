import typescript from '@rollup/plugin-typescript'

const libraryName = 'fexios'

export default {
  input: 'src/index.ts',
  output: [
    { file: `dist/${libraryName}.umd.js`, name: libraryName, format: 'umd' },
    { file: `dist/${libraryName}.js`, name: libraryName, format: 'es' }
  ],
  // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
  external: [],
  watch: {
    include: 'src/**',
  },
  plugins: [
    typescript()
  ],
}

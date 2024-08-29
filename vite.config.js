import { defineConfig } from 'vite';
import pkg from './package.json'

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.ts',
      name: 'DolphinCSV',
      formats: ['es', 'cjs', 'umd'],
      fileName: (format) => `index.${pkg.version}.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {}
      }
    },
    outDir: 'dist/packages'
  }
});

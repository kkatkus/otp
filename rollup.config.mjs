import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
  // JS build (CJS + ESM)
  {
    input: 'src/index.ts',
    output: [
      { file: 'dist/cjs/index.js', format: 'cjs', sourcemap: true },
      { file: 'dist/esm/index.js', format: 'esm', sourcemap: true },
    ],
    plugins: [typescript({ tsconfig: './tsconfig.json', declaration: false })],
  },
  // DTS bundle
  {
    input: 'src/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'es' }],
    plugins: [dts()],
  },
];

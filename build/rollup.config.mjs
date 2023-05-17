import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs';


// Workaround from https://www.stefanjudis.com/snippets/how-to-import-json-files-in-es-modules-node-js/
//import plugin from '../package.json' assert { type: 'json' }; // the future, throughs today an experimental warning

// Option 1:
import { readFile } from 'fs/promises';
let plugin = JSON.parse(
  await readFile(
    new URL('../package.json', import.meta.url)
  )
);


let input = "src/index.js";
let output = {
  file: "dist/" + plugin.name + "-src.js",
  format: "umd",
  sourcemap: true,
  name: plugin.name,
  globals: {
    'jszip': 'JSZip',
    'geojson-vt': 'geojsonvt',
    '@tmcw/togeojson': 'toGeoJSON',
  }
};

let external = ['jszip', 'geojson-vt', '@tmcw/togeojson', 'leaflet-pointable'];
let plugins = [
  resolve(),
  commonJS({
    include: '../node_modules/**'
  })
];

export default [{
    input: input,
    output: output,
    plugins: plugins,
    external: external,
  },
  {
    input: input,
    output: Object.assign({}, output, {
      file: "dist/" + plugin.name + ".js"
    }),
    plugins: plugins.concat(terser()),
    external: external
  }
];

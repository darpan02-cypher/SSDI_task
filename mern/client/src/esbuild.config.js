import esbuild from 'esbuild';

esbuild.build({
  entryPoints: ['./src/index.js'],
  bundle: true,
  outfile: './dist/bundle.js',
  loader: { '.js': 'jsx' },  // Add this to enable JSX parsing in .js files
}).catch(() => process.exit(1));

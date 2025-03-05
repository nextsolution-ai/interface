const esbuild = require('esbuild');

esbuild.build({
  entryPoints: ['src/widget.js'],
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es2015'],
  outfile: 'dist/voiceflow-chat.js',
  format: 'iife',
  globalName: 'VoiceflowChat',
  loader: {
    '.js': 'jsx',
    '.jsx': 'jsx',
    '.css': 'text'
  },
  define: {
    'process.env.NODE_ENV': '"production"',
    'process.env.REACT_APP_VOICEFLOW_API_KEY': '"VF.DM.67c85533afdb459652c6488d.s4Xd2YebJqSNWjES"',
    'process.env.REACT_APP_PROJECT_ID': '"67c855152108cc3a1af64b96"',
    'process.env.REACT_APP_VERSION_ID': '"67c855152108cc3a1af64b97"'
  },
  jsxFactory: 'React.createElement',
  jsxFragment: 'React.Fragment',
  inject: ['./src/react-shim.js'],
  banner: {
    js: `
      if (typeof window !== 'undefined') {
        window.global = window;
        window.process = { env: { NODE_ENV: 'production' } };
      }
    `
  },
  footer: {
    js: `
      window.VoiceflowChat = VoiceflowChat.default || VoiceflowChat;
    `
  }
}).catch(() => process.exit(1)); 
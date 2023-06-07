const esbuild = require('esbuild');

module.exports = function JavascriptCompiler(options = {}) {
    const defaultOptions = {
        target: 'es2020',
        minify: true,
        bundle: true,
        write: false
    }

    return {
        compile: async filePath => {
            return await esbuild.build({
                entryPoints: [filePath],
                ...Object.assign({}, defaultOptions, options)
            });
        }
    }
}
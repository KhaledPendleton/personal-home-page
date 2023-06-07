const path = require('node:path');

const SassCompiler = require('./compilers/sass.js');
const JsCompiler = require('./compilers/javascript.js');

const isProduction = process.env.NODE_ENV === 'production';

const generateSassOutputPermalink = (_contents, inputPath) => {
    return _data => {
        const { name } = path.parse(inputPath);
        if(name.startsWith("_")) { return false; }
        return `/assets/css/${name}.css`;
    }
}

const generateJsOutputPermalink = (_contents, inputPath) => {
    const { name } = path.parse(inputPath);
    if (path.dirname(inputPath) !== './src/assets/js') { return false; }
    return `/assets/js/${name}.js`;
}

module.exports = eleventyConfig => {
    // COMPILE SASS
    const sassCompiler = SassCompiler({
        loadPaths: ['./src/assets/scss'],
        style: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded'
    });

    eleventyConfig.addTemplateFormats('scss');
    eleventyConfig.addExtension('scss', {
        outputFileExtension: 'css',
        compileOptions: { permalink: generateSassOutputPermalink },
        compile: function (inputContent) {
            const css = sassCompiler.compile(inputContent);
            return async _data => css;
        }
    });

    // COMPILE JAVASCRIPT
    const jsCompiler = JsCompiler();

    eleventyConfig.addTemplateFormats('js');
    eleventyConfig.addExtension('js', {
        outputFileExtension: 'js',
        compileOptions: { permalink: generateJsOutputPermalink },
        compile: async function (_inputContent, inputPath) {
            const bundle = await jsCompiler.compile(inputPath);
            const outputFile = bundle.outputFiles[0];
            return async _data => outputFile.text;
        } 
    });

    if (isProduction) {
        eleventyConfig.setQuietMode(true);
    }

    return {
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        dir: {
            input: 'src',
            output: 'site'
        }
    };
}
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
    eleventyConfig.addCollection('projects', (collection) => {
        return collection.getFilteredByGlob('./src/projects/*.md');
    });

    eleventyConfig.addCollection('project-updates', (collection) => {
        return collection.getFilteredByGlob('./src/projects/updates/*.md')
    });

    // COMPILE SASS
    const sassCompiler = SassCompiler({
        loadPaths: ['./src/assets/scss'],
        style: process.env.NODE_ENV === 'production' ? 'compressed' : 'expanded'
    });

    eleventyConfig.addTemplateFormats('scss');
    eleventyConfig.addExtension('scss', {
        outputFileExtension: 'css',
        compileOptions: { permalink: generateSassOutputPermalink },
        compile: function (inputContent, inputPath) {
            const {css, loadedUrls} = sassCompiler.compile(inputContent);
            this.addDependencies(inputPath, loadedUrls); // TODO: Link to docs
            return async _data => css;
        }
    });

    // COMPILE JAVASCRIPT
    const jsCompiler = JsCompiler({metafile: true});

    eleventyConfig.addTemplateFormats('js');
    eleventyConfig.addExtension('js', {
        outputFileExtension: 'js',
        compileOptions: { permalink: generateJsOutputPermalink },
        compile: async function (_inputContent, inputPath) {
            const {metafile, outputFiles} = await jsCompiler.compile(inputPath);
            this.addDependencies(inputPath, Object.keys(metafile.inputs));
            return async _data => outputFiles[0].text;
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
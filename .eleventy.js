const isProduction = process.env.NODE_ENV === 'production';

module.exports = eleventyConfig => {
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
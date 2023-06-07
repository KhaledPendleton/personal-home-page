const sass = require('sass');

module.exports = function SassCompiler(options = {}) {
    return {
        compile: fileContents => {
            const result = sass.compileString(fileContents, options);
            return result;
        }
    }
}
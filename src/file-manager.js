var jspm = require("jspm");

exports.factory = function(less) {
  return class extends less.FileManager {
    constructor(options) {
      super();
      this.options = options;
      this.loader = new jspm.Loader();
      this.loader.config({
        defaultJSExtensions: false
      });
    }
    supports(filename) {
      return filename.startsWith(this.options.prefix);
    }
    supportsSync(filename) {
      return this.supports(filename);
    }
    resolve(filename) {
      return this.loader.normalize(filename.slice(this.options.prefix.length));
    }
    resolveSync(filename) {
      return this.loader.normalizeSync(filename.slice(this.options.prefix.length));
    }
    loadFile(filename, ...args) {
      return this.resolve(filename).then((filename) => (
        super.loadFile(filename, ...args)
      ));
    }
    loadFileSync(filename, ...args) {
      return super.loadFileSync(this.resolveSync(filename), ...args);
    }
    tryAppendExtension(path) {
      return path;
    }
    tryAppendLessExtension(path) {
      return path;
    }
  };
};

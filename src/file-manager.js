var jspm = require("jspm");

exports.factory = function(less) {
  return class extends less.FileManager {
    constructor(options) {
      this.options = options;
      this.loader = new jspm.Loader();
    }
    supports(filename) {
      return filename.startsWith(this.options.prefix);
    }
    supportsSync(filename) {
      return this.supports(filename);
    }
    resolve(filename) {
      return this.loader.normalize(filename);
    }
    resolveSync(filename) {
      return this.loader.normalizeSync(filename);
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

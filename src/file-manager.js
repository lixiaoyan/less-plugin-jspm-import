var path = require("path");
var jspm = require("jspm");

function resolveURL(filename) {
  return filename.replace(/^file:\/\//, "").replace(/^([a-zA-Z])\//, "$1:/").replace(/\//g, path.sep);
}

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
      return this.loader.normalize(filename.slice(this.options.prefix.length)).then((filename) => (
        resolveURL(filename.replace(/\.js$/, ""))
      ));
    }
    resolveSync(filename) {
      return resolveURL(this.loader.normalizeSync(filename.slice(this.options.prefix.length)).replace(/\.js$/, ""));
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

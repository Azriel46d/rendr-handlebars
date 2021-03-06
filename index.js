var Handlebars = require('handlebars')
  , templateFinder = require('./shared/templateFinder')(Handlebars);

/**
 * Export the `Handlebars` object, so other modules can add helpers, partials, etc.
 */
exports.Handlebars = Handlebars;

/**
 * `getTemplate` is available on both client and server.
 */
exports.getTemplate = templateFinder.getTemplate;

/**
 * Expose `templatePatterns` for manipulating how `getTemplate` finds templates.
 */
exports.templatePatterns = templateFinder.templatePatterns;

/**
 * `getLayout` should only be used on the server.
 */
if (typeof window === 'undefined') {
  exports.getLayout = require('./server/layoutFinder')(Handlebars).getLayout;
} else {
  exports.getLayout = function() {
    throw new Error('getLayout is only available on the server.');
  };
}

/** 
 * Register the rendr App so that in the handlebar Helpers, the app instance is available at all times
 */
exports.registerRendrApp = function registerRendrApp(app){
    if (app){
        Handlebars.app = app;
    }
};

/**
 * Register helpers, available on both client and server.
 *
 * Export it so other modules can register helpers as well.
 */
exports.registerHelpers = function registerHelpers(helpersModule) {
  var helpers = helpersModule(Handlebars, exports.getTemplate);

  for (var key in helpers) {
    if (!helpers.hasOwnProperty(key)) continue;
    Handlebars.registerHelper(key, helpers[key]);
  }
};

/**
 * Register the pre-bundled Rendr helpers.
 */
var rendrHelpers = require('./shared/helpers');
exports.registerHelpers(rendrHelpers);

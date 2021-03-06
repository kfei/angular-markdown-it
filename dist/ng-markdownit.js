(function(window, angular, markdownit) {
  'use strict';
  function markdownItProvider() {
    var options = {};
    var presetName = 'default';
    return {
      config: function(preset, opts) {
        if (angular.isString(preset) && angular.isObject(opts)) {
          presetName = preset;
          options = opts;
        } else if (angular.isString(preset)) {
          presetName = preset;
        } else if (angular.isObject(preset)) {
          options = preset;
        }
      },
      $get: function() {
        return markdownit(presetName, options);
      }
    };
  }
  function markdownItDirective($sanitize, markdownIt) {
    var attribute = 'markdownIt';
    var render = function(value) {
      return value ? $sanitize(markdownIt.render(value)) : '';
    };
    var link = function(scope, element, attrs) {
      if (attrs[attribute]) {
        scope.$watch(attribute, function(value) {
          element.html(render(value));
        });
      } else {
        element.html(render(element.text()));
      }
    };
    return {
      restrict: 'AE',
      scope: {
        markdownIt: '='
      },
      replace: true,
      link: link
    };
  }
  angular.module('mdMarkdownIt', ['ngSanitize'])
    .provider('markdownItConverter', markdownItProvider)
    .directive('markdownIt', ['$sanitize', 'markdownItConverter', markdownItDirective]);
})(window, window.angular, window.markdownit);

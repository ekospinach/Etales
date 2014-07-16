// requestAnimationFrame polyfill by Erik MÃ¶ller. fixes from Paul Irish and Tino Zijdel
(function() {
  'use strict';
  
  
  (function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame =
        window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
      window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() {
            callback(currTime + timeToCall);
          },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
      };

    if (!window.cancelAnimationFrame)
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
      };
  }());
  
  
  angular.module('ui.slider', [])
    .directive('uiSlider', [

      function() {


        // Get all the page.
        var htmlElement = angular.element(document.body.parentElement);
        var domElement = '<div class="ui-slider-container">\n  <div class="ui-slider-runnable-track">\n    <div class="ui-slider-slider-thumb"></div>\n  </div>\n</div>';

        return {
          require: '?ngModel',
          template: domElement,
          link: function(scope, iElement, attrs, ngModel) {

            var animationFrameRequested, lastPos;
            var _cache = {};
            var track = iElement.children().children();
            var thumb = track.children();

            var options = angular.extend({}, scope.$eval(attrs.uiSlider));

            // Watch ui-slider (byVal) for changes and update
            scope.$watch(attrs.uiSlider, function(newVal) {
              options = angular.extend(options, newVal);
            }, true);

            function _cached_layout_values() {

              if (_cache.time && +new Date() < _cache.time + 1000) return; // after ~60 frames

              // track bounding box
              var track_bb = track[0].getBoundingClientRect();
              var thumb_bb = thumb[0].getBoundingClientRect();

              _cache.time = +new Date();
              _cache.trackOrigine = track_bb.left; //(-track_bb.left - track[0].offsetLeft - thumb[0].offsetWidth / 2 ) * 100 / track[0].offsetWidth;
              _cache.trackSize = track_bb.width;
              _cache.thumbSize = thumb_bb.width;
            }

            function _handleMouseEvent(mouseEvent) {
              // Store the mouse position for later
              lastPos = mouseEvent.x;

              // Cancel previous rAF call
              if (animationFrameRequested) window.cancelAnimationFrame(animationFrameRequested);

              _cached_layout_values();

              // Animate the page outside the event
              animationFrameRequested = window.requestAnimationFrame(function drawAndUpdateTheModel() {

                var the_thumb_pos = (lastPos - _cache.trackOrigine - _cache.thumbSize / 2) / _cache.trackSize * 100;

                if (options.step) {
                  the_thumb_pos = Math.floor(the_thumb_pos / options.step) * options.step;
                }

                // Here we clamp the result to be beetween 0 and 100
                the_thumb_pos = Math.min(Math.max(the_thumb_pos, 0), 100);


                // The displayed result need to be reClamp 'cause a left 100% will display the thumb outside the track !
                // So the display max is 100% - the width of the thumb in pencente.
                thumb.css('left', '' + Math.min(Math.max(the_thumb_pos, 0), 100 - (_cache.thumbSize / _cache.trackSize) * 100) + '%');


                if (ngModel) {
                  ngModel.$setViewValue(the_thumb_pos);
                  if (!scope.$$phase) {
                    scope.$apply();
                  }
                }
              });

            }

            if (ngModel) {
              ngModel.$formatters.push(function(value) {
                return ((angular.isNumber(value)) ? value : 0);
              });

              ngModel.$render = function() {
                var the_thumb_pos = ngModel.$viewValue;

                _cached_layout_values();

                // Use ngmodel.$formatters ??
                if (options.step) {
                  the_thumb_pos = Math.floor(the_thumb_pos / options.step) * options.step;
                }

                // Cancel previous rAF call
                if (animationFrameRequested) window.cancelAnimationFrame(animationFrameRequested);

                // Animate the page outside the event
                animationFrameRequested = window.requestAnimationFrame(function drawFromTheModelValue() {
                  //lastMouseXPosition = ((ngModel.$viewValue || 0) / 100) * cachedLayoutValue.track_width + cachedLayoutValue.additionalWidth;
                  thumb.css('left', '' + Math.min(the_thumb_pos, 100 - _cache.thumbSize / _cache.trackSize * 100) + '%');
                });
              };
            }

            // Bind the click on the bar then you can move it all over the page.
            iElement.bind('mousedown', function(e) {
              e.preventDefault();
              e.stopPropagation();
              _handleMouseEvent(e); // Handle simple click
              htmlElement.bind('mousemove', _handleMouseEvent);
              return false;
            });
            htmlElement.bind('mouseup', function(e) {
              e.preventDefault();
              e.stopPropagation();
              htmlElement.unbind('mousemove');
              return false;
            });

          }
        };
      }
    ]);



}());
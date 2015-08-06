// INITIALIZATION *************************************************************

var myJsPlumb = require('./myJsPlumb.js');
var $treeScreen;
var $treeDisplay;
var $panzoom;
var lastPosition = {};

// METHODS ********************************************************************

function initializePanZoom() {
  console.log("initializePanZoom");

  if (!$treeScreen || !$treeDisplay) {
    $treeScreen = $("#tree-screen");
    $treeDisplay = $("#tree-display");  
  }

  $treeScreen.click(function() { $treeScreen.trigger('focus'); });

  // Set up panzoom configs.
  if (!$panzoom) { $panzoom = $treeDisplay.panzoom(); }
  $panzoom.panzoom('option', {
    transition: true,
    duration: 500,
    easing: "ease-in-out",
    minScale: 0.1,
    maxScale: 2,
    increment: 0.5
  });
  $panzoom.panzoom('transition');

  enableHotKeys();
  enableMouseZoom();
  enableScreenDrag();
}


// HELPERS ********************************************************************

function enableHotKeys() {
  $treeScreen.bind("keydown", function(e) {
    var code = e.keyCode || e.which;
    var panRate = 200;
    switch(code) {
      case 81: // q
        $(GlobalEvents).trigger("sidebar:toggle");
        break;
      case 87: // w
        $treeDisplay.panzoom("pan", 0, panRate, { relative: true });
        break;
      case 69: // e
        myJsPlumb.toggleGroupDrag();
        break;
      case 83: // s
        $treeDisplay.panzoom("pan", 0, -panRate, { relative: true });
        break;
      case 65: // a
        $treeDisplay.panzoom("pan", panRate, 0, { relative: true });
        break;
      case 68: // d
        $treeDisplay.panzoom("pan", -panRate, 0, { relative: true });
        break;
      default:
        return;
    }
  });
}

function enableMouseZoom() {
  $panzoom.parent().on('mousewheel.focal', function( e ) {
    e.preventDefault();
    // e.stopPropagation();
    var delta = e.delta || e.originalEvent.wheelDelta;
    var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;

    $panzoom.panzoom('zoom', zoomOut, {
      increment: 0.1,
      animate: false,
      focal: e
    });

    // Get the current scale.
    var matrix = $treeDisplay.panzoom("getMatrix");
    var zoomLevel = Number(matrix[0]);
    myJsPlumb.setZoom(zoomLevel);
  });
}

function enableScreenDrag() {
  $treeScreen.on('mousemove', function (event) {
    if (event.which === 1 && event.target === this) {
      if (typeof(lastPosition.x) != 'undefined') {
        var deltaX = lastPosition.x - event.clientX;
        var deltaY = lastPosition.y - event.clientY;

        $treeDisplay.panzoom("pan", -1 * deltaX, -1 * deltaY, 
          { relative: true });
      }

      lastPosition = {
        x : event.clientX,
        y : event.clientY
      };
    }
  }).on('mouseup', function() {
    lastPosition = {};
  });
}

// EXPORTS ********************************************************************

module.exports = {
  initializePanZoom: initializePanZoom
};

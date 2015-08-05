var plumbPanZoom = require('../../../js/plumbPanZoom.js');
var LogicCard = require('./LogicCard/LogicCard.jsx');

var Tree = React.createClass({

  componentDidMount: function() {
    console.log("Tree component did mount.");
    var _this = this;

    jsPlumb.ready(function() {
      // FIXME: Race condition bug.
      plumbPanZoom.drawConnections();
    });

    $(GlobalEvents).on('global_tree:changed', function(ev) {
      console.log("The tree changed.");
      _this.forceUpdate();
    });

    plumbPanZoom.panzoom();

    // Allow screen drag.
    var last_position = {};
    $treeDisplay = $("#tree-display");
    $("#tree-screen").on('mousemove', function (event) {
      if (event.which === 1 && event.target === this) {
        if (typeof(last_position.x) != 'undefined') {
          var deltaX = last_position.x - event.clientX;
          var deltaY = last_position.y - event.clientY;

          // console.log("Delta: " + deltaX + " " + deltaY);
          $treeDisplay.panzoom("pan", -1 * deltaX, -1 * deltaY, 
            { relative: true });
        }

        last_position = {
          x : event.clientX,
          y : event.clientY
        };
      }
    }).on('mouseup', function() {
      last_position = {};
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log("Tree componentDidUpdate");
    plumbPanZoom.drawConnections();
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off('global_tree:changed');
  },

  resetTree: function(childContext) {
    console.log("Resetting the tree.");
    GTC.resetTree().refresh();
  },

  zoom: function(ev) {
  },

  _dragScreen: function(ev) {
    console.log("Dragging.");
  },

  render: function() {
    console.log("Re-rendered.");

    var _this = this;

    // Draw out all the logic cards from the currentTree.
    logicCardViews = {};

    var currentTree = GTC.getTree();
    // console.log(currentTree);

    for (i in currentTree) {

      // This uuid is different from the cardID; otherwise the virtual DOM
      // gets confused.
      var uuid = guid();
      var settings = {};
      $.extend(settings, currentTree[i], {
        key: uuid, 
        ref: currentTree[i].cardID
      });

      logicCardViews[i] = React.createElement(LogicCard, settings);
    }

    // console.log(logicCardViews);

    return (
      <div id="tree-screen" tabIndex="1">
        <div id="tree-display" onWheel={_this.zoom}>
          {logicCardViews}
        </div>
      </div>
    );
  }
});

module.exports = Tree;

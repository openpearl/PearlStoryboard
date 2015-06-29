var plumbPanZoom = require('../../../js/plumbPanZoom.js');
var LogicCard = require('./LogicCard.jsx');

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

  render: function() {
    console.log("Re-rendered.");

    var _this = this;

    // Draw out all the logic cards from the currentTree.
    logicCardViews = {};

    var currentTree = GTC.getTree();
    for (i in currentTree) {

      // This uuid is different from the cardID; otherwise the virtual DOM
      // gets confused.
      var uuid = guid();
      logicCardViews[i] = 
        <LogicCard
          key={uuid}
          ref={currentTree[i].cardID}
          
          cardID={currentTree[i].cardID}
          childrenCardIDs={currentTree[i].childrenCardIDs}
          parentCardIDs={currentTree[i].parentCardIDs}

          speaker={currentTree[i].speaker}
          message={currentTree[i].message}

          xpos={currentTree[i].xpos}
          ypos={currentTree[i].ypos}
        />
    }

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

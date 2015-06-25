var plumbPanZoom = require('../../../js/plumbPanZoom.js');
var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  componentDidMount: function() {
    console.log("Tree component did mount.");
    var _this = this;
    var jsPlumbReady = false;

    jsPlumb.ready(function() {
      plumbPanZoom.drawConnections();
      jsPlumbReady = true;
    });

    $(GlobalEvents).on('global_tree:changed', function(ev) {
      console.log("The tree changed.");
      _this.forceUpdate();
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    plumbPanZoom.drawConnections();
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off('global_tree:changed');
  },

  resetTree: function(childContext) {
    console.log("Resetting the tree.");
    GlbTreeCtrl.resetTree();
  },

  zoom: function(ev) {
  },

  render: function() {
    console.log("Re-rendered.");

    var _this = this;

    // Draw out all the logic cards from the currentTree.
    logicCardViews = {};

    var currentTree = GlbTreeCtrl.getTree();
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
        />
    }

    return (
      <div id="tree-screen">
        <div id="tree-display" onWheel={_this.zoom}>
          {logicCardViews}
        </div>
      </div>
    );
  }
});

module.exports = Tree;

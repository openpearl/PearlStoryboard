var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  componentDidMount: function() {
    console.log("Tree component did mount.");
    var _this = this;

    jsPlumb.ready(function() {
      var logicCardReferences = document.querySelectorAll(".logic-card");
      jsPlumb.setContainer(document.getElementById("tree-display"));
      jsPlumb.draggable(logicCardReferences);

      // Draw the connectors.
      var currentTree = GlbTreeCtrl.getTree();
      for (i in currentTree) {
        var cardIDSelector = '#' + currentTree[i].cardID;
        var cardIDNode = jsPlumb.getSelector(cardIDSelector)[0];

        var childrenCardIDs = currentTree[i].childrenCardIDs;
        for (j in childrenCardIDs) {
          var childIDSelector = '#' + childrenCardIDs[j];
          var childIDNode = jsPlumb.getSelector(childIDSelector)[0];
          jsPlumb.connect({
            source: cardIDNode, 
            target: childIDNode
          });
        }
      }
    });

    $(GlobalEvents).on('global_tree:changed', function(ev) {
      _this.forceUpdate();
    });
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
    var _this = this;

    // Draw out all the logic cards from the currentTree.
    logicCardViews = {};

    var currentTree = GlbTreeCtrl.getTree();
    for (i in currentTree) {
      logicCardViews[i] = 
        <LogicCard
          key={currentTree[i].cardID}
          ref={currentTree[i].cardID}
          
          cardID={currentTree[i].cardID}
          childrenCardIDs={currentTree[i].childrenCardIDs}
          parentCardIDs={currentTree[i].parentCardIDs}

          speaker={currentTree[i].speaker}
          message={currentTree[i].message}
        />
    }

    return (
      <div id="tree-display" onWheel={_this.zoom}>
        {logicCardViews}
      </div>
    );
  }
  
});

module.exports = Tree;

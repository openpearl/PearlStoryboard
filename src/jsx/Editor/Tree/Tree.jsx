var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  componentDidMount: function() {
    console.log("Tree component did mount.");
    var _this = this;

    // Draw the connectors.
    var currentTree = GlbTreeCtrl.getTree();
    console.log(currentTree);
    for (i in currentTree) {
      var cardIDSelector = '#' + currentTree[i].cardID;
      var childrenCardIDs = currentTree[i].childrenCardIDs;
      for (j in childrenCardIDs) {
        var childIDSelector = '#' + childrenCardIDs[j];

        console.log("Drawing lines!");
        console.log(cardIDSelector);
        console.log(childIDSelector);
        jsPlumb.connect(cardIDSelector, childIDSelector);
      }
    }

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

    return (<div id="tree-display">{logicCardViews}</div>);
  }
  
});

module.exports = Tree;

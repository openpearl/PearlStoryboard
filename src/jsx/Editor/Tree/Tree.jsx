var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  componentDidMount: function() {
    var _this = this;
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

    // Draw out all the logic cards from the GlobalTree.
    logicCardViews = {};
    for (i in GlobalTree) {
      logicCardViews[i] = 
        <LogicCard
          key={GlobalTree[i].cardID}
          ref={GlobalTree[i].cardID}
          
          cardID={GlobalTree[i].cardID}
          childrenCardIDs={GlobalTree[i].childrenCardIDs}
          parentCardIDs={GlobalTree[i].parentCardIDs}

          speaker={GlobalTree[i].speaker}
          message={GlobalTree[i].message}
        />
    }

    return (<div id="tree-display">{logicCardViews}</div>);
  }
  
});

module.exports = Tree;

var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  componentDidMount: function() {
    console.log("Tree component did mount.");
    var _this = this;

    jsPlumb.ready(function() {

      console.log("I'm doing a jsPlumb.");

      var logicCardReferences = document.querySelectorAll(".logic-card");
      jsPlumb.setContainer(document.getElementById("tree-display"));
      jsPlumb.draggable(logicCardReferences);

      // TODO: Package into function so that this can be recalled.
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

    //   // Panzoom.
    //   $treeDisplay = $("#tree-display");
    //   $panzoom = $("#tree-display").panzoom();
    //   $panzoom.parent().on('mousewheel.focal', function( e ) {
    //     e.preventDefault();
    //     // e.stopPropagation();
    //     var delta = e.delta || e.originalEvent.wheelDelta;
    //     var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
    //     console.log(delta);

    //     $panzoom.panzoom('zoom', zoomOut, {
    //       increment: 0.1,
    //       animate: false,
    //       focal: e
    //     });

    //     // Get the current scale.
    //     var matrix = $treeDisplay.panzoom("getMatrix");
    //     var a = matrix[0];
    //     var b = matrix[1];
    //     var scale = Math.sqrt(a*a + b*b);
    //     console.log(scale);
    //     jsPlumb.setZoom(scale);
    //   });
    });

    $(GlobalEvents).on('global_tree:changed', function(ev) {
      console.log("The tree changed.");

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

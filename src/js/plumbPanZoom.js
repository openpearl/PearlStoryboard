jsPlumb.ready(function() {

  // Set jsPlumb defaults.
  jsPlumb.importDefaults({
    PaintStyle : {
      lineWidth:13,
      strokeStyle: 'rgba(200,0,0,0.5)'
    },
    DragOptions : { cursor: "crosshair" },
    Endpoint: ["Dot", { radius: 7}],
    Endpoints : [ [ "Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ],
    EndpointStyles : [{ fillStyle:"#225588" }, { fillStyle:"#558822" }],
    // Anchor: "Continuous",
    Anchor: [ "Continuous", { faces:["top","bottom"] }],    
    // Anchors : ["BottomCenter", "TopCenter"],
    MaxConnections: 99,
  });

});

module.exports = {

  drawConnections: function() {
    console.log("I'm doing a jsPlumb.");

    // Find the parent and all the different nodes.
    var logicCardReferences = document.querySelectorAll(".logic-card");
    console.log(logicCardReferences);

    jsPlumb.setContainer(document.getElementById("tree-display"));
    jsPlumb.draggable(logicCardReferences);

    // Clear all existing connections.
    jsPlumb.detachEveryConnection();
    jsPlumb.deleteEveryEndpoint();
    jsPlumb.reset();

    // Set endpoint defaults.
    var endpointOptions = {
      isSource: true,
      reattach: true,
    }

    // Draw the connectors.
    var currentTree = GTC.getTree();
    for (i in currentTree) {
      var cardIDSelector = '#' + currentTree[i].cardID;
      var cardIDNode = jsPlumb.getSelector(cardIDSelector)[0];

      // var endpoint = jsPlumb.addEndpoint(cardIDNode, endpointOptions);

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
  },

  panzoom: function() {
    // Panzoom.
    $treeDisplay = $("#tree-display");
    $panzoom = $("#tree-display").panzoom();

    $("#tree-screen").bind("keydown", function(e) {
      console.log("Key pressed.");
      var code = e.keyCode || e.which;
      
      switch(code) {
        case 87: // w
          console.log("W was pressed.");
          break;
        case 83: // s
          console.log("S was pressed.");
          break;
        case 65: // a
          console.log("A was pressed.");
          break;
        case 68: // d
          console.log("D was pressed.");
          break;
        default:
          return;
      }
    });

    $panzoom.parent().on('mousewheel.focal', function( e ) {
      e.preventDefault();
      // e.stopPropagation();
      var delta = e.delta || e.originalEvent.wheelDelta;
      var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      // console.log(delta);

      $panzoom.panzoom('zoom', zoomOut, {
        increment: 0.1,
        animate: false,
        focal: e
      });

      // FIXME: This is problematic.
      // Get the current scale.
      // var matrix = $treeDisplay.panzoom("getMatrix");
      // var zoomLevel = matrix[0];

      // console.log(zoomLevel);
      // jsPlumb.setZoom(zoomLevel);
    });




    // $("#tree-screen").mousedown(function(){
    //     $(this).mousemove(function(e){
    //       console.log(e);
    //       console.log(e.deltaX);
    //       console.log(e.deltaY);

    //     });
    // });
    // $("#tree-screen").mouseup(function(){
    //     $(this).unbind("mousemove");
    // });
  }
};

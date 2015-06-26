plumbInstance = {};

jsPlumb.ready(function() {

  plumbInstance = jsPlumb.getInstance();

  // Set jsPlumb defaults.
  plumbInstance.importDefaults({
    PaintStyle : {
      lineWidth:13,
      strokeStyle: 'rgba(200,0,0,0.5)'
    },
    DragOptions : { cursor: "crosshair" },
    Endpoint: ["Dot", { radius: 7}],
    Endpoints : [ [ "Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ],
    EndpointStyles : [{ fillStyle:"#225588" }, { fillStyle:"#558822" }],
    Anchor: [ "Continuous", { faces:["top","bottom"] }],    
    MaxConnections: 99,
  });

});

module.exports = {

  drawConnections: function() {
    console.log("I'm doing a plumbInstance.");

    // Find the parent and all the different nodes.
    var logicCardReferences = document.querySelectorAll(".logic-card");
    console.log(logicCardReferences);

    plumbInstance.setContainer(document.getElementById("tree-display"));
    plumbInstance.draggable(logicCardReferences);

    // Clear all existing connections.
    plumbInstance.detachEveryConnection();
    plumbInstance.deleteEveryEndpoint();
    plumbInstance.reset();

    // Set endpoint defaults.
    var endpointOptions = {
      isSource: true,
      isTarget: true,
      reattach: true,
    }

    // Draw the connectors.
    var currentTree = GTC.getTree();
    for (i in currentTree) {
      var cardIDSelector = '#' + currentTree[i].cardID;
      var cardIDNode = plumbInstance.getSelector(cardIDSelector)[0];

      plumbInstance.setSuspendDrawing(true);
      var endpoint = plumbInstance.addEndpoint(cardIDNode, endpointOptions);

      var childrenCardIDs = currentTree[i].childrenCardIDs;
      for (j in childrenCardIDs) {
        var childIDSelector = '#' + childrenCardIDs[j];
        var childIDNode = plumbInstance.getSelector(childIDSelector)[0];

        plumbInstance.connect({
          source: cardIDNode, 
          target: childIDNode
        });
      }
      plumbInstance.setSuspendDrawing(false, true);
    }
  },

  panzoom: function() {
    $treeScreen = $("#tree-screen");
    $treeDisplay = $("#tree-display");

    $treeScreen.click(function() {
      $treeScreen.trigger('focus');
    });

    // Panzoom.
    $panzoom = $treeDisplay.panzoom();
    $panzoom.panzoom('option', {
      transition: true,
      duration: 500,
      easing: "ease-in-out",
    });
    $panzoom.panzoom('transition');

    $("#tree-screen").bind("keydown", function(e) {
      var code = e.keyCode || e.which;
      var panRate = 200;
      switch(code) {
        // TODO: Refactor the q button to go elsewhere.
        case 81: // q
          $(GlobalEvents).trigger("sidebar:toggle");
          break;
        case 87: // w
          $treeDisplay.panzoom("pan", 0, panRate, { relative: true });
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
      // plumbInstance.setZoom(Number(zoomLevel), true);
      // plumbInstance.setZoom(Number(zoomLevel));
      // console.log(plumbInstance.getZoom());
      // plumbInstance.setZoom(zoomLevel);
    });
  }
};

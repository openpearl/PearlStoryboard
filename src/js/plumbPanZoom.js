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
    Anchors : [ "Bottom", "Top" ],    
    MaxConnections: 99,
  });

});

module.exports = {

  drawConnections: function() {
    console.log("drawConnections.");
    console.log(plumbInstance.getAllConnections());    

    // Clear all existing connections.
    plumbInstance.detachEveryConnection();
    plumbInstance.deleteEveryEndpoint();
    plumbInstance.reset();

    console.log("Resetting sources and targets.");
    plumbInstance = plumbInstance.unmakeEverySource().unmakeEveryTarget();


    console.log(plumbInstance.getAllConnections());    

    console.log(plumbInstance.getContainer());
    if (plumbInstance.getContainer() === undefined) {
      plumbInstance.setContainer(document.getElementById("tree-display"));
    }

    // Draw the connectors.
    // plumbInstance.setSuspendDrawing(true);
    var currentTree = GTC.getTree();
    for (i in currentTree) {
      var cardIDSelector = '#' + currentTree[i].cardID + ' .lc-source';
      var cardIDNode = $(cardIDSelector);

      plumbInstance.makeSource(cardIDNode, {
        isSource: true,
        anchor:"Continuous",
        endpoint:["Rectangle", { width:40, height:20 }],
        maxConnections: 10,
        onMaxConnections:function(info, originalEvent) {
          console.log("element is ", info.element, "maxConnections is", info.maxConnections); 
        }
      });

      var childrenCardIDs = currentTree[i].childrenCardIDs;
      for (j in childrenCardIDs) {
        var childIDSelector = '#' + childrenCardIDs[j] + ' .lc-sink';
        var childIDNode = $(childIDSelector);

        plumbInstance.makeTarget(childIDNode, {
          isTarget: true,
          ConnectionsDetachable: true,
          anchor:"Continuous",
          endpoint:["Rectangle", { width:40, height:20 }],
          maxConnections: 10,
          onMaxConnections:function(info, originalEvent) {
            console.log("element is ", info.element, "maxConnections is", info.maxConnections); 
          }
        });

        plumbInstance.connect({
          source: cardIDNode, 
          target: childIDNode,
          // reattach:true
        });

      }
    }

    // plumbInstance.setSuspendDrawing(false, true);

    var draggables = [];
    for (k in currentTree) {
      draggables.push($('#' + currentTree[k].cardID));
      // draggables.push($('#' + currentTree[k].cardID  + ' .lc-source'));
      // draggables.push($('#' + currentTree[k].cardID  + ' .lc-sink'));
    }
    plumbInstance.draggable(draggables);
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

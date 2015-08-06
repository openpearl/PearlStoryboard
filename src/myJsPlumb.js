// INITIALIZATION *************************************************************

var pushIfUnique = require('./utils').pushIfUnique;
var plumbInstance = {};
var canGroupDrag = false;

// Initialize defaults.
jsPlumb.ready(function() {

  plumbInstance = jsPlumb.getInstance();
  plumbInstance.importDefaults({
    PaintStyle : {
      lineWidth:5,
      strokeStyle: 'rgba(63,81,181,1)'
    },
    DragOptions : { cursor: "crosshair" },
    Endpoint: ["Dot", { radius: 7}],
    EndpointStyle: { fillStyle: "#303F9F" },
    Anchor: [ "Continuous", { faces:["top","bottom"] }],
    Anchors : [ "Bottom", "Top" ],    
    MaxConnections: 99,
    Connector: "Straight",
    Overlays:[ 
      ["Arrow" , { width:30, length:30, location: 0.7 }]
    ]
  });
});

// METHODS ********************************************************************

function drawConnections() {
  console.log("drawConnections.");

  resetConnections();

  // Set the container if not already set.
  if (plumbInstance.getContainer() === undefined) {
    plumbInstance.setContainer(document.getElementById("tree-display"));
  }

  // Common endpoint settings.
  var commEndSettings = {
    maxConnections: 99,
    anchor: "Continuous",
    onMaxConnections:function(info, originalEvent) {
      console.log("element is ", info.element, "maxConnections is", 
        info.maxConnections); 
    }
  };

  plumbInstance.setSuspendDrawing(true); // Freeze rendering.

  var cardIDSelector;
  var cardIDNode;
  var currentTree = GTC.getTree();

  // Create the sources and targets.
  for (var i in currentTree) {
    cardIDSelector = '#' + currentTree[i].cardID + ' .logic-card-wrapper';
    cardIDNode = $(cardIDSelector);
    plumbInstance.makeSource(cardIDNode, {isSource: true}, commEndSettings);
    plumbInstance.makeTarget(cardIDNode, {isTarget: true}, commEndSettings);
  }

  // Make the connections between sources and respective targets.
  for (var j in currentTree) {
    cardIDSelector = '#' + currentTree[j].cardID + ' .logic-card-wrapper';
    cardIDNode = $(cardIDSelector);
    
    var childrenCardIDs = currentTree[j].childrenCardIDs;
    for (var k in childrenCardIDs) {
      var childIDSelector = 
        '#' + childrenCardIDs[k] + ' .logic-card-wrapper';
      var childIDNode = $(childIDSelector)[0];
      var childNodeParent = $(childIDSelector).parent()[0];

      if (childNodeParent.style.visibility === 'visible') {
        plumbInstance.connect({
          source: cardIDNode, 
          target: childIDNode
        });  
      }
    }
  }

  plumbInstance.setSuspendDrawing(false, true); // Render all connections.

  setConnectionBindings();
  setDraggables(currentTree);
}

function setZoom(zoomLevel) {
  plumbInstance.setZoom(zoomLevel);
}

function toggleGroupDrag() {
  canGroupDrag = !canGroupDrag;
}

function addToDragSelection(subTreeDraggables) {
  if (canGroupDrag) {
    plumbInstance.addToDragSelection(subTreeDraggables);
  }
}

function clearDragSelection() {
  plumbInstance.clearDragSelection();
}

// HELPERS ********************************************************************

function resetConnections() {
  // Clear all existing connections.
  plumbInstance.unbind("connection");
  plumbInstance.unbind("connectionDetached");
  plumbInstance.detachEveryConnection();
  plumbInstance.deleteEveryEndpoint();
  plumbInstance.reset();
  plumbInstance = plumbInstance.unmakeEverySource().unmakeEveryTarget();
}

function setConnectionBindings() {
  // Bind events to update our models.
  plumbInstance.bind("connection", function(conn, ev) {
    console.log("This connection has attached.");

    // Figure out the source and target.
    var sourceID = $(conn.source).parent().attr('id');
    var targetID = $(conn.target).parent().attr('id');

    // Fetch the right nodes from the GlobalTree.
    var source = GTC.getLogicCard(sourceID);
    var target = GTC.getLogicCard(targetID);

    source.childrenCardIDs = pushIfUnique(source.childrenCardIDs, targetID);
    target.parentCardIDs = pushIfUnique(target.parentCardIDs, sourceID);

    GTC.setLogicCard(source);
    GTC.setLogicCard(target);
  });

  plumbInstance.bind("connectionDetached", function(conn, ev) {
    console.log("This connection has detached.");

    // Figure out the source and target.
    var sourceID = $(conn.source).parent().attr('id');
    var targetID = $(conn.target).parent().attr('id');

    // Fetch the right nodes from the GlobalTree.
    var source = GTC.getLogicCard(sourceID);
    var target = GTC.getLogicCard(targetID);


    // Get index of IDs.
    var i = source.childrenCardIDs.indexOf(targetID);
    var j = target.parentCardIDs.indexOf(sourceID);

    // Remove the ID from the nodes.
    if (i > -1) { source.childrenCardIDs.splice(i, 1); }
    if (j > -1) { target.parentCardIDs.splice(j, 1); }

    GTC.setLogicCard(source);
    GTC.setLogicCard(target);
  });
}

function setDraggables(cardsObject) {
  var draggables = [];

  for (var l in cardsObject) {
    draggables.push($('#' + cardsObject[l].cardID));
  }

  plumbInstance.draggable(draggables);
}

// EXPORTS ********************************************************************

module.exports = {
  drawConnections: drawConnections,
  setZoom: setZoom,
  toggleGroupDrag: toggleGroupDrag,
  addToDragSelection: addToDragSelection,
  clearDragSelection: clearDragSelection
};

// Set jsPlumb defaults.
jsPlumb.ready(function() {
  jsPlumb.importDefaults({
    PaintStyle : {
      lineWidth:13,
      strokeStyle: 'rgba(200,0,0,0.5)'
    },
    DragOptions : { cursor: "crosshair" },
    Endpoints : [ [ "Dot", { radius:7 } ], [ "Dot", { radius:11 } ] ],
    EndpointStyles : [{ fillStyle:"#225588" }, { fillStyle:"#558822" }],
    Anchors : ["BottomCenter", "TopCenter"]
  });
});

module.exports = {
  pushIfUnique: function(currentArray, queuedItem) {
    var found = $.inArray(queuedItem, currentArray);
    if (found >= 0) {
      return;
    } else {
      // Element was not found, add it.
      currentArray.push(queuedItem);
    }
  }
}

// Holder for the processed tree document.
var GlobalTree = {
  // Requirements:
  // cardID: String,
  // childrenCardIDs: [String],
  // parentCardIDs: [String],

  // speaker: String,
  // message: String,

  // visible: true,
  // highlight: false,
};

var GlbTreeCtrl = {
  getTree: getTree,
  setTree: setTree,
  clearTree: clearTree,
  getLogicCard: getLogicCard,
  setLogicCard: setLogicCard,
  deleteLogicCard: deleteLogicCard,
  toggleVisibility: toggleVisibility
};

var $GlobalEvents = $(GlobalEvents);

function getTree() {
  return GlobalTree;
}

function setTree(inputTree) {
  GlobalTree = inputTree;
  $GlobalEvents.trigger("global_tree:changed");
}

function clearTree() {
  GlobalTree = {};
  $GlobalEvents.trigger("global_tree:changed");
}

function getLogicCard(logicCardID) {
  return GlobalTree[logicCardID];
}

function setLogicCard(logicCard) {
  GlobalTree[logicCard.cardID] = logicCard;
  $GlobalEvents.trigger("global_tree:changed");
}

function deleteLogicCard(logicCardID) {
  var parentCardIDs = GlobalTree[logicCardID].parentCardIDs;
  var childrenCardIDs = GlobalTree[logicCardID].childrenCardIDs;

  // Remove the associated ID from parents.
  for (i in parentCardIDs) {
    var parentCard = GlbTreeCtrl.getLogicCard(parentCardIDs[i]);
    var index = parentCard.childrenCardIDs.indexOf(logicCardID);
    if (index > -1) { array.splice(index, 1); }
  }

  // And do the same for the children.
  for (j in childrenCardIDs) {
    var childrenCard = GlbTreeCtrl.getLogicCard(childrenCardIDs[i]);
    var index = childrenCard.parentCardIDs.indexOf(logicCardID);
    if (index > -1) { array.splice(index, 1); }
  }

  // Delete and then notify.
  delete GlobalTree[logicCardID];
  $GlobalEvents.trigger("global_tree:changed");
}

function toggleVisibility(logicCardID) {
  GlobalTree[logicCardID].visible = !GlobalTree[logicCardID].visible;
  var childrenCardIDs = GlobalTree[logicCardID].childrenCardIDs;
  
  // Base case.
  if (childrenCardIDs.length === 0) { return; }

  // Recurse.
  for (i in childrenCardIDs) {
    GlbTreeCtrl.toggleVisibility(childrenCardIDs[i]);
  }

  // Callback.
  $GlobalEvents.trigger("global_tree:changed");
}

module.exports = GlbTreeCtrl;

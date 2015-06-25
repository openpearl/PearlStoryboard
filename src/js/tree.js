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

  // xpos: String,
  // ypos: String,
};

var $GlobalEvents = $(GlobalEvents);

var GlbTreeProto = function GlbTreeProto() {};
GlbTreeProto.prototype = {
  refresh: refresh,

  getTree: getTree,
  setTree: setTree,
  clearTree: clearTree,

  getLogicCard: getLogicCard,
  setLogicCard: setLogicCard,
  deleteLogicCard: deleteLogicCard,

  toggleVisibility: toggleVisibility
};

var GlbTreeCtrl = function GlbTreeCtrl() {
  return new GlbTreeProto();
}

function refresh() {
  // Save positions of all nodes.
  for (i in GlobalTree) {
    console.log(i);
    var logicCard = document.querySelector('#' + i);
    console.log(logicCard);
    if (logicCard === null) {
      $GlobalEvents.trigger("global_tree:changed");
      return this;
    }

    GlobalTree[i].xpos = logicCard.style.top;
    GlobalTree[i].ypos = logicCard.style.left;
  }

  $GlobalEvents.trigger("global_tree:changed");
  return this;
}

function getTree() {
  return GlobalTree;
}

function setTree(inputTree) {
  GlobalTree = inputTree;
  return this;
}

function clearTree() {
  GlobalTree = {};
  return this;
}

function getLogicCard(logicCardID) {
  return GlobalTree[logicCardID];
}

function setLogicCard(logicCard) {
  console.log("Setting the logic card.");

  // Update the logic card.
  var result = GlobalTree[logicCard.cardID] || {};
  for (key in logicCard) { result[key] = logicCard[key]; }

  GlobalTree[logicCard.cardID] = logicCard;
  return this;
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

  return this;
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
  return this;
}

module.exports = GlbTreeCtrl();

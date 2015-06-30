var $GlobalEvents = $(GlobalEvents); // Global event system.
var GlobalTree = {}; // Holder for the processed tree document.
CardSchema = {
  cardID: "default", // String
  childrenCardIDs: [], // [String]
  parentCardIDs: [], // [String] 

  speaker: "", // String
  messages: [], // [String]

  tagnames: [], // [String]
  conditionals: [], // [String]

  visible: true, // Boolean
  highlight: false, // Boolean

  xpos: 0, // Number
  ypos: 0, // Number
}

var GlbTreeProto = function GlbTreeProto() {};
GlbTreeProto.prototype = {
  done: done,
  refresh: refresh,

  getTree: getTree,
  setTree: setTree,
  saveTree: saveTree,
  clearTree: clearTree,

  getLogicCard: getLogicCard,
  setLogicCard: setLogicCard,
  deleteLogicCard: deleteLogicCard,

  toggleVisibility: toggleVisibility
};

var GlbTreeCtrl = function GlbTreeCtrl() {
  return new GlbTreeProto();
}

function done(callback) {
  callback();
}

function refresh() {
  savePos();
  $GlobalEvents.trigger("global_tree:changed");
  return this;
}

function savePos() {
  // Save positions of all nodes.
  for (i in GlobalTree) {
    var logicCard = document.querySelector('#' + i);
    if (logicCard === null) {
      // TODO: Figure out what this does.
      // $GlobalEvents.trigger("global_tree:changed");
      // return this;
    } else {
      GlobalTree[i].xpos = Number(logicCard.style.left.slice(0,-2));
      GlobalTree[i].ypos = Number(logicCard.style.top.slice(0,-2));
    }
  }
}

function getTree() {
  return GlobalTree;
}

function setTree(inputTree) {
  GlobalTree = inputTree;

  // FIXME: This may be a naive and excessive way of doing things.
  // Filter to add in missing empty arrays.
  for (i in GlobalTree) {
    for (j in CardSchema) {
      if (!GlobalTree[i][j]) {
        GlobalTree[i][j] = CardSchema[j];
      }
    }
  }

  return this;
}

function clearTree() {
  GlobalTree = {};
  return this;
}

function saveTree() {
  var data = GlobalTree;
  var _this = this;

  $.ajax({
    type: "POST",
    url: "/save",
    data: data,
    success: function() { return _this;}
  });
}

function getLogicCard(logicCardID) {
  return GlobalTree[logicCardID];
}

function setLogicCard(logicCard) {
  console.log("Setting the logic card.");

  // Update the logic card.
  var result = {};
  $.extend(result, GlobalTree[logicCard.cardID], logicCard);

  GlobalTree[logicCard.cardID] = result;
  return this;
}

function deleteLogicCard(logicCardID) {
  var parentCardIDs = GlobalTree[logicCardID].parentCardIDs;
  var childrenCardIDs = GlobalTree[logicCardID].childrenCardIDs;

  console.log(parentCardIDs);
  console.log(childrenCardIDs);

  // Remove the associated ID from parents.
  for (i in parentCardIDs) {
    var parentCard = GlobalTree[parentCardIDs[i]];
    if (parentCard) {
      var index = parentCard.childrenCardIDs.indexOf(logicCardID);
      if (index > -1) { parentCard.childrenCardIDs.splice(index, 1); }
      setLogicCard(parentCard);
    }
  }

  // And do the same for the children.
  for (j in childrenCardIDs) {
    var childCard = GlobalTree[childrenCardIDs[j]];
    if (childCard) {
      var index = childCard.parentCardIDs.indexOf(logicCardID);
      if (index > -1) { childCard.parentCardIDs.splice(index, 1); }
      setLogicCard(childCard);
    }
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

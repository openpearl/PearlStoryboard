var $GlobalEvents = $(GlobalEvents); // Global event system.
var GlobalTree = {}; // Holder for the processed tree document.

CardSchema = {
  cardID: "root", // String
  childrenCardIDs: [], // [String]
  parentCardIDs: [], // [String] 

  speaker: "", // String
  filters: [], // [String]
  inputs: [], // [String]

  cardBody: {
    messages: [], // [String]  
  },

  ui: { // Only for visualization. Will get removed on final save.
    visible: true, // Boolean
    highlight: false, // Boolean

    xpos: 300, // Number
    ypos: 300, // Number  
  }
};

var GlbTreeProto = function GlbTreeProto() {};
GlbTreeProto.prototype = {
  done: done,
  refresh: refresh,

  getTree: getTree,
  setTree: setTree,
  saveTree: saveTree,
  clearTree: clearTree,

  getSubTree: getSubTree,
  modifySubTree: modifySubTree,

  getLogicCard: getLogicCard,
  setLogicCard: setLogicCard,
  deleteLogicCard: deleteLogicCard
};

var GlbTreeCtrl = function GlbTreeCtrl() {
  return new GlbTreeProto();
};

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
  for (var i in GlobalTree) {
    var logicCard = document.querySelector('#' + i);
    if (logicCard === null) {
      // TODO: Figure out what this does.
      // $GlobalEvents.trigger("global_tree:changed");
      // return this;
    } else {
      GlobalTree[i].ui.xpos = Number(logicCard.style.left.slice(0,-2));
      GlobalTree[i].ui.ypos = Number(logicCard.style.top.slice(0,-2));
    }
  }
}

function getTree() {
  if ($.isEmptyObject(GlobalTree)) {
    GlobalTree.root = CardSchema;
  }

  // console.log(GlobalTree);
  return GlobalTree;
}

function setTree(inputTree) {
  GlobalTree = inputTree;

  // FIXME: This may be a naive and excessive way of doing things.
  // Filter to add in missing empty arrays.
  for (var i in GlobalTree) {
    for (var j in CardSchema) {
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
  savePos();

  var data = GlobalTree;
  var _this = this;

  $.ajax({
    type: "POST",
    url: "/save",
    data: data,
    success: function() { return _this;}
  });
}

function getSubTree(logicCardID, customMethod) {
  var card = GlobalTree[logicCardID];
  card.isVisited = true; // Prevents infinite recursion.
  // Base case.
  if (card.childrenCardIDs === undefined) {
    return [card.cardID];
  } else {
    if (card.childrenCardIDs.length === 0) {
      return [card.cardID];
    }
  }

  // Recursively locate all children.
  var biggerSubTree = [card.cardID];
  for (var i in card.childrenCardIDs) {
    var child = GlobalTree[card.childrenCardIDs[i]];
    if (!child.isVisited) {
      var subTreeCards = getSubTree(card.childrenCardIDs[i]);    
      biggerSubTree = biggerSubTree.concat(subTreeCards);  
    } else {
      return [card.cardID];
    }
  }

  // Remove visited tags.
  // for (var j in biggerSubTree) {
  for (var j in biggerSubTree) {
    delete GlobalTree[biggerSubTree[j]].isVisited;
  }

  // Propogate recursion to the top.
  return biggerSubTree;
}

// TODO: This doesn't feel DRY.
function modifySubTree(logicCardID, includeParent, customMethod) {
  var card = GlobalTree[logicCardID];
  card.isVisited = true; // Prevents infinite recursion.

  // Determines if the modification should apply to the root as well.
  if (includeParent) { card = customMethod(card); }

  // Base case.
  if (card.childrenCardIDs === undefined) {
    return;
  } else {
    if (card.childrenCardIDs.length === 0) {
      return;
    }
  }

  // Recursively locate all children.
  var biggerSubTree = [card.cardID];
  for (var i in card.childrenCardIDs) {
    if (!card.childrenCardIDs[i].isVisited) {
      modifySubTree(card.childrenCardIDs[i], true, customMethod);    
    }
  }

  // Remove visited tags.
  for (var j in biggerSubTree) {
    delete GlobalTree[biggerSubTree[j]].isVisited;
  }

  return this;
}

function getLogicCard(logicCardID) {
  return GlobalTree[logicCardID];
}

function setLogicCard(logicCard) {
  console.log("Setting the logic card.");

  // Update the logic card.
  var result = {};
  var cardInData = GlobalTree[logicCard.cardID];
  if (cardInData === undefined) { cardInData = CardSchema; }
  $.extend(true, result, cardInData, logicCard);

  // console.log(logicCard.cardID);
  // console.log(result);

  GlobalTree[logicCard.cardID] = result;
  // console.log(GlobalTree);

  return this;
}

function deleteLogicCard(logicCardID) {
  var parentCardIDs = GlobalTree[logicCardID].parentCardIDs;
  var childrenCardIDs = GlobalTree[logicCardID].childrenCardIDs;

  console.log(parentCardIDs);
  console.log(childrenCardIDs);

  // Remove the associated ID from parents.
  for (var i in parentCardIDs) {
    var parentCard = GlobalTree[parentCardIDs[i]];
    if (parentCard) {
      var index = parentCard.childrenCardIDs.indexOf(logicCardID);
      if (index > -1) { parentCard.childrenCardIDs.splice(index, 1); }
      setLogicCard(parentCard);
    }
  }

  // And do the same for the children.
  for (var j in childrenCardIDs) {
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

module.exports = GlbTreeCtrl();

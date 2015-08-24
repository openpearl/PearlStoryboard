var $GlobalEvents = $(GlobalEvents); // Global event system.
var GlobalTree = {}; // Holder for the processed tree document.

var GlbTreeProto = function GlbTreeProto() {};
GlbTreeProto.prototype = {
  done: done,
  refresh: refresh,

  getTree: getTree,
  setTree: setTree,
  saveTree: saveTree,
  cleanUpTree: cleanUpTree,
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

// METHODS ********************************************************************

function done(next) {
  next();
}

function refresh() {
  savePos();
  $GlobalEvents.trigger("global_tree:changed");
  return this;
}

function getTree() {
  if ($.isEmptyObject(GlobalTree)) {
    GlobalTree.root = CardSchema;
  }
  return GlobalTree;
}

function setTree(inputTree) {
  GlobalTree = inputTree;

  // FIXME: This may be a naive and excessive way of doing things.
  // Filter to add in missing empty arrays.
  for (var card in GlobalTree) {
    for (var attribute in CardSchema) {
      if (!GlobalTree[card][attribute]) {
        GlobalTree[card][attribute] = CardSchema[attribute];
      }
    }
  }

  return this;
}

function clearTree() {
  GlobalTree = {};
  return this;
}

function saveTree(callback) {
  if (callback === undefined) {
    callback = function() {};
  }

  savePos();

  var data = $.extend(true, {}, GlobalTree); // Deep copy.
  var _this = this;

  _this.cleanUpTree(data);

  $.ajax({
    type: "POST",
    url: "/save",
    data: data,
    success: function() { callback(); return _this; }
  });
}

// TODO: Hacky cleanup filter.
function cleanUpTree(JSObject) {
  if (typeof JSObject === "object") {
    for (var prop in JSObject) {
      
      // Empty array.
      if (JSObject[prop].constructor === Array) {
        if (JSObject[prop][0] === "" || JSObject[prop].length === 0) {
          delete JSObject[prop];     
        }   
      }

      // Empty string.
      else if (JSObject[prop] === "" || JSObject[prop].length === 0) {
        delete JSObject[prop];
      }

      // Recurse downwards.
      else {
        cleanUpTree(JSObject[prop]);  
      }
    }
  } else { return; }
}

function getSubTree(logicCardID) {

  var recurseSubTree = function(logicCardID) {
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

    return biggerSubTree;
  };

  var resultingTree = recurseSubTree(logicCardID);

  // Remove visited tags.
  for (var j in resultingTree) {
    delete GlobalTree[resultingTree[j]].isVisited;
  }

  // Propogate recursion to the top.
  return resultingTree;
}

// TODO: This doesn't feel DRY.
function modifySubTree(logicCardID, includeParent, customMethod) {

  var recurseSubTree = function(logicCardID, includeParent, customMethod) {
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
    for (var i in card.childrenCardIDs) {
      if (!card.childrenCardIDs[i].isVisited) {
        modifySubTree(card.childrenCardIDs[i], true, customMethod);    
      }
    }
  };

  recurseSubTree(logicCardID, includeParent, customMethod);

  // Remove visited tags.
  for (var j in GlobalTree) {
    delete GlobalTree[j].isVisited;
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
  GlobalTree[logicCard.cardID] = result;
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

// HELPERS ********************************************************************

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

// EXPORTS ********************************************************************

module.exports = GlbTreeCtrl();

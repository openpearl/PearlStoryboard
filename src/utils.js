// METHODS ********************************************************************

function pushIfUnique(_currentArray, queuedItem) {
  var currentArray = _currentArray;
  var returnedArray = [];

  var found = $.inArray(queuedItem, currentArray);
  if (found >= 0) {
    returnedArray = currentArray;
    return returnedArray;
  } else {
    // Element was not found, add it.
    if (currentArray === undefined || currentArray === "") {
      currentArray = [];
    }

    // Voodoo magic right here. .push() DOES NOT WORK!
    // Current hypothesis:
    // First, push() returns true or false.
    // Seco nd, push() modifies existing array.
    returnedArray = currentArray.concat([queuedItem]);
    return returnedArray;
  }
}

function guid() {
  return 'id_' + s4() + s4() + s4() + s4();
}

// HELPERS ********************************************************************

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
}

// EXPORTS ********************************************************************

module.exports = {
  pushIfUnique: pushIfUnique,
  guid: guid
};

module.exports = {

  pushIfUnique: function(currentArray, queuedItem) {
    var returnedArray = [];

    var found = $.inArray(queuedItem, currentArray);
    if (found >= 0) {
      returnedArray = currentArray;
      return returnedArray;
    } 
    else {
      // Element was not found, add it.
      if (
        currentArray === undefined || 
        currentArray === ""
      ) {
        var currentArray = [];
      }

      // Voodoo magic right here. .push() DOES NOT WORK!
      // Current hypothesis:
      // First, push() returns true or false.
      // Second, push() modifies existing array.
      returnedArray = currentArray.concat([queuedItem]);
      return returnedArray;
    }
  }
};

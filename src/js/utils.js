module.exports = {

  pushIfUnique: function(currentArray, queuedItem) {
    var found = $.inArray(queuedItem, currentArray);
    if (found >= 0) {
      return currentArray;
    } else {
      // Element was not found, add it.
      if (currentArray === undefined) {
        var currentArray = [];
      }

      currentArray.push(queuedItem);
      return currentArray;
    }
  }
  
}

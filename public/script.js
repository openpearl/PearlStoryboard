(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return 'uuid_' + s4() + s4() + s4() + s4();
}

},{}],2:[function(require,module,exports){
jsPlumb.ready(function() {

  // Set jsPlumb defaults.
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

  drawConnections: function() {
    console.log("I'm doing a jsPlumb.");

    // Find the parent and all the different nodes.
    var logicCardReferences = document.querySelectorAll(".logic-card");
    console.log(logicCardReferences);

    jsPlumb.setContainer(document.getElementById("tree-display"));
    jsPlumb.draggable(logicCardReferences);

    // Draw the connectors.
    var currentTree = GTC.getTree();
    for (i in currentTree) {
      var cardIDSelector = '#' + currentTree[i].cardID;
      var cardIDNode = jsPlumb.getSelector(cardIDSelector)[0];

      var childrenCardIDs = currentTree[i].childrenCardIDs;
      for (j in childrenCardIDs) {
        var childIDSelector = '#' + childrenCardIDs[j];
        var childIDNode = jsPlumb.getSelector(childIDSelector)[0];
        jsPlumb.connect({
          source: cardIDNode, 
          target: childIDNode
        });
      }
    }
  },

  panzoom: function() {
    // Panzoom.
    $treeDisplay = $("#tree-display");
    $panzoom = $("#tree-display").panzoom();
    $panzoom.parent().on('mousewheel.focal', function( e ) {
      e.preventDefault();
      // e.stopPropagation();
      var delta = e.delta || e.originalEvent.wheelDelta;
      var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
      console.log(delta);

      $panzoom.panzoom('zoom', zoomOut, {
        increment: 0.1,
        animate: false,
        focal: e
      });

      // Get the current scale.
      var matrix = $treeDisplay.panzoom("getMatrix");
      var a = matrix[0];
      var b = matrix[1];
      var scale = Math.sqrt(a*a + b*b);
      console.log(scale);
      jsPlumb.setZoom(scale);
    });
  }

};

},{}],3:[function(require,module,exports){
// Disable console.log during production.
// var console = {};
// console.log = function(){};
// console.warn = function(){};
// window.console = console;

guid = require('./guid.js'); // GUID Generator.
utils = require('./utils.js'); // Utility scripts.
pushIfUnique = utils.pushIfUnique;

// React Router requirements.
var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;
var RouteHandler = window.ReactRouter.RouteHandler;
var Editor = require('../jsx/Editor/Editor.jsx');

GlobalEvents = {}; // Global event system.
GTC = require('./tree.js');

var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement(RouteHandler, null)
    );
  }
});

var routes = (
  React.createElement(Route, {handler: App}, 
    React.createElement(Route, {handler: Editor})
  )
);

// Start rendering React only when documents have been loaded.
$.ajax({
  type: "GET",
  url: "files/input.json",
  dataType: "json",
  success: function(data) {
    GTC.setTree(data).refresh();
    Router.run(routes, function (Handler) {
      React.render(React.createElement(Handler, null), document.getElementById('content'));
    });
  }
});

},{"../jsx/Editor/Editor.jsx":7,"./guid.js":1,"./tree.js":4,"./utils.js":5}],4:[function(require,module,exports){
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

// var GlbTreeCtrl = {
//   refresh: refresh,

//   getTree: getTree,
//   setTree: setTree,
//   clearTree: clearTree,

//   getLogicCard: getLogicCard,
//   setLogicCard: setLogicCard,
//   deleteLogicCard: deleteLogicCard,

//   toggleVisibility: toggleVisibility
// };

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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
var ContentEditable = React.createClass({displayName: "ContentEditable",
	render: function(){
		return React.createElement("div", {
			onInput: this.emitChange, 
			onBlur: this.emitChange, 
			contentEditable: true, 
			dangerouslySetInnerHTML: {__html: this.props.html}});
	},
	shouldComponentUpdate: function(nextProps){
		return nextProps.html !== this.getDOMNode().innerHTML;
	},
	emitChange: function(){
		var html = this.getDOMNode().innerHTML;
		if (this.props.onChange && html !== this.lastHtml) {

			this.props.onChange({
				target: {
					value: html,
					// Determines which source the content is from.
					sourceState: this.props.sourceState
				}
			});
		}
		this.lastHtml = html;
	}
});

module.exports = ContentEditable;

},{}],7:[function(require,module,exports){
var MessageBank = require("./MessageBank/MessageBank.jsx");
var Tree = require("./Tree/Tree.jsx");

var Editor = React.createClass({displayName: "Editor",

  render: function() {
    return (
      React.createElement("div", {id: "editor-page"}, 
        React.createElement(MessageBank, null), 
        React.createElement(Tree, null)
      )
    );
  }

});

module.exports = Editor;

},{"./MessageBank/MessageBank.jsx":8,"./Tree/Tree.jsx":11}],8:[function(require,module,exports){
var MessageCard = require('./MessageCard.jsx');

var MessageBank = React.createClass({displayName: "MessageBank",

  getInitialState: function () {
    return { messageBank: [] };
  },

  componentDidMount: function() {
    var _this = this;
    $.ajax({
      type: "GET",
      url: "files/messages.csv",
      dataType: "text",
      success: function(data) {
        console.log("messages.csv loaded.");
        _this.state.messageBank = data.split(/\r\n|\n/);
        _this.setState(_this.state);
        _this.bindSearch();
      }
    });
  },

  bindSearch: function() {
    $messages = $(".message-card");
    $('#searchbar').keyup(function() {
      var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
      $messages.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
      }).hide();
    });
  },

  toggleBank: function(){
    console.log("Toggling bank.");
    $("#message-bank").toggle();
  },

  setDownloadLink: function(messagesJson, downloadName, linkMessage) {
    var data = "text/json;charset=utf-8," 
      + encodeURIComponent(JSON.stringify(messagesJson));

    $('#download-link').empty();
    $('<a href="data:' + data + '" download=' + downloadName + '>'
      + linkMessage + '</a>').appendTo('#download-link');
  },

  triggerSaveTree: function() {
    $(GlobalEvents).trigger('tree:save');
  },

  downloadTree: function() {
    this.setDownloadLink(ProcessedTree, "final.json",
      "Download final conversion.");
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (var i in _this.state.messageBank) {
      var uuid = guid();
      messageCards.push(React.createElement(MessageCard, {
        key: uuid, message: _this.state.messageBank[i]}));
    }

    return (
      React.createElement("div", null, 
        React.createElement("div", {id: "button-storage"}, 
      
          React.createElement("div", {className: "bt-menu", onClick: _this.toggleBank}, 
            React.createElement("i", {className: "fa fa-bars"})
          ), 

          React.createElement("div", {className: "bt-menu"}, 
            React.createElement("i", {className: "fa fa-floppy-o"})
          ), 

          React.createElement("div", {className: "bt-menu", onClick: _this.downloadTree}, 
            React.createElement("i", {className: "fa fa-download"})
          ), 

          React.createElement("form", {
            encType: "multipart/form-data", 
            action: "  /files/processedTree", 
            method: "post"}, 
            React.createElement("input", {type: "file", name: "file"}), 
            React.createElement("input", {type: "submit"}, React.createElement("i", {className: "fa fa-upload"}))
          ), 
      
          React.createElement("div", {id: "download-link"})
        ), 

        React.createElement("div", {id: "message-bank"}, 
          React.createElement("input", {type: "text", id: "searchbar", placeholder: "Search: "}), 
          React.createElement("div", null, messageCards)
        )
      
      )
    );
  }
});

module.exports = MessageBank;

},{"./MessageCard.jsx":9}],9:[function(require,module,exports){
var MessageCard = React.createClass({displayName: "MessageCard",

  // Handle collecting data for a drag.
  dragStart: function(ev) {
    var _this = this;
    var data = { message: _this.props.message };
    ev.dataTransfer.setData('text', JSON.stringify(data));
  },

  render: function() {
    var _this = this;
    return (
      React.createElement("div", {className: "message-card", draggable: "true", 
        onDragStart: _this.dragStart}, 
        React.createElement("div", null, _this.props.message)
      )
    );
  }
});

module.exports = MessageCard;

},{}],10:[function(require,module,exports){
var ContentEditable = require('../../ContentEditable.jsx');

var LogicCard = React.createClass({displayName: "LogicCard",

  getInitialState: function() {
    var _this = this;
    var uuid = guid();

    return {
      cardID: _this.props.cardID || uuid,
      childrenCardIDs: _this.props.childrenCardIDs || [],
      parentCardIDs: _this.props.parentCardIDs || [],

      speaker: _this.props.speaker || "",
      message: _this.props.message || "",

      visible: true,
      highlight: false,
    };
  },

  preventDefault: function(ev) { ev.preventDefault(); },

  // Creates a new card.
  handleAdd: function() {
    var _this = this;
    var uuid = guid();

    // Creates a new Logic card and save it into the GlobalTree.
    GTC.setLogicCard({
      cardID: uuid,
      childrenCardIDs: [],
      parentCardIDs: [_this.state.cardID],
      speaker: "",
      message: "",
      visible: true,
      highlight: false
    }).refresh();

  },

  toggleVisibility: function() {
    GTC.toggleVisibility(_this.state.cardID).refresh();
  },

  deleteCard: function() {
    GTC.deleteLogicCard(this.state.cardID).refresh();
  },

  // Handle collecting information when dropping a card from the messageBank.
  handleDrop: function(ev) {
    ev.preventDefault();
    console.log("Something was dropped!");

    var _this = this;
    var data;

    try { data = JSON.parse(ev.dataTransfer.getData('text')); }
    catch (e) { return; }

    console.log(data);
    var card = GTC.getLogicCard(_this.state.cardID);
    card.message = data.message;
    console.log(card);

    GTC.setLogicCard(card).refresh();
  },

  handleMouseEnter: function(ev) {
    ev.preventDefault();
  },

  handleMouseLeave: function(ev) {
    ev.preventDefault();
  },

  render: function() {
    var _this = this;

    var newOrAddButton;
    var hideButton;
    var deleteButton;

    var childrenTreeStyle;
    var hideButtonStyle;

    // Toggle depending on visibility.
    // TODO: Package or shorten for cleaner code.
    if (_this.state.visible === true) {
      childrenTreeStyle = classNames({
        'hide': false
      });
      hideButtonStyle = classNames({
        'fa': true,
        'fa-bookmark': true,
        'fa-bookmark-o': false
      });
    } else {
      childrenTreeStyle = classNames({
        'hide': true
      });
      hideButtonStyle = classNames({
        'fa': true,
        'fa-bookmark': false,
        'fa-bookmark-o': true
      });
    }

    // Toggle if there are any child logic cards.
    if ($.isEmptyObject(_this.state.childrenCards)) {
      newOrAddButton = React.createElement("i", {className: "fa fa-arrow-right"});
      hideButton = React.createElement("div", null);
    } else {
      newOrAddButton = React.createElement("i", {className: "fa fa-plus"});
      hideButton = (
        React.createElement("div", {className: "hide-card-button", onClick: _this.toggleVisibility}, 
          React.createElement("i", {className: hideButtonStyle})
        )
      );
    }

    return (
      React.createElement("div", {className: "logic-card", 
        id: _this.state.cardID, 
        onMouseEnter: _this.handleMouseEnter, 
        onMouseLeave: _this.handleMouseLeave}, 
        React.createElement("div", {className: "logic-card-content", 
          onDragOver: _this.preventDefault, 
          onDrop: _this.handleDrop}, 
          React.createElement("span", null, "ID: "), 
          React.createElement("div", null, _this.state.cardID), 
          React.createElement("span", null, "Children IDs: "), 
          React.createElement("div", null, _this.state.childrenCardIDs), 
          React.createElement("span", null, "Speaker: "), 
          React.createElement(ContentEditable, {html: _this.state.speaker, 
            sourceState: "speaker"}), 
          React.createElement("span", null, "Message: "), 
          React.createElement(ContentEditable, {html: _this.state.message, 
            sourceState: "message"}), 
          React.createElement("div", {className: "card-buttons-container"}, 
            React.createElement("div", {className: "add-card-button", onClick: _this.handleAdd}, 
              newOrAddButton
            ), 

            hideButton, 

            React.createElement("div", {className: "delete-card-button", 
              onClick: _this.deleteCard}, 
              React.createElement("i", {className: "fa fa-times"})
            )

          )
        )
      )
    );
  }
});

module.exports = LogicCard;

},{"../../ContentEditable.jsx":6}],11:[function(require,module,exports){
var plumbPanZoom = require('../../../js/plumbPanZoom.js');
var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({displayName: "Tree",

  componentDidMount: function() {
    console.log("Tree component did mount.");
    var _this = this;
    var jsPlumbReady = false;

    jsPlumb.ready(function() {
      plumbPanZoom.drawConnections();
      jsPlumbReady = true;
    });

    $(GlobalEvents).on('global_tree:changed', function(ev) {
      console.log("The tree changed.");
      _this.forceUpdate();
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    plumbPanZoom.drawConnections();
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off('global_tree:changed');
  },

  resetTree: function(childContext) {
    console.log("Resetting the tree.");
    GTC.resetTree().refresh();
  },

  zoom: function(ev) {
  },

  render: function() {
    console.log("Re-rendered.");

    var _this = this;

    // Draw out all the logic cards from the currentTree.
    logicCardViews = {};

    var currentTree = GTC.getTree();
    for (i in currentTree) {

      // This uuid is different from the cardID; otherwise the virtual DOM
      // gets confused.
      var uuid = guid();
      logicCardViews[i] = 
        React.createElement(LogicCard, {
          key: uuid, 
          ref: currentTree[i].cardID, 
          
          cardID: currentTree[i].cardID, 
          childrenCardIDs: currentTree[i].childrenCardIDs, 
          parentCardIDs: currentTree[i].parentCardIDs, 

          speaker: currentTree[i].speaker, 
          message: currentTree[i].message}
        )
    }

    return (
      React.createElement("div", {id: "tree-screen"}, 
        React.createElement("div", {id: "tree-display", onWheel: _this.zoom}, 
          logicCardViews
        )
      )
    );
  }
});

module.exports = Tree;

},{"../../../js/plumbPanZoom.js":2,"./LogicCard.jsx":10}]},{},[3]);

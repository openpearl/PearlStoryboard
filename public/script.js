(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '_' + s4() + '_' + s4() + '_' +
    s4() + '_' + s4() + s4() + s4();
}

},{}],2:[function(require,module,exports){
guid = require('./guid.js'); // GUID Generator.
utils = require('./utils.js'); // Utility scripts.
pushIfUnique = utils.pushIfUnique;

// React Router requirements.
var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;
var RouteHandler = window.ReactRouter.RouteHandler;
var Editor = require('../jsx/Editor/Editor.jsx');

GlobalEvents = {}; // Global event system.
GlbTreeCtrl = require('./tree.js');

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
    GlobalTree = data;

    Router.run(routes, function (Handler) {
      React.render(React.createElement(Handler, null), document.getElementById('content'));
    });
  }
});

},{"../jsx/Editor/Editor.jsx":6,"./guid.js":1,"./tree.js":3,"./utils.js":4}],3:[function(require,module,exports){
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
  clearTree: clearTree,
  getLogicCard: getLogicCard,
  setLogicCard: setLogicCard,
  deleteLogicCard: deleteLogicCard,
  toggleVisibility: toggleVisibility
};

function getTree() {
  return GlobalTree;
}

function clearTree() {
  GlobalTree = {};
  $(GlobalEvents).trigger("global_tree:changed");
}

function getLogicCard(logicCardID) {
  return GlobalTree[logicCardID];
}

function setLogicCard(logicCard) {
  GlobalTree[logicCard[cardID]] = logicCard;
  $(GlobalEvents).trigger("global_tree:changed");
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
  $(GlobalEvents).trigger("global_tree:changed");
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
  $(GlobalEvents).trigger("global_tree:changed");
}

module.exports = GlbTreeCtrl;

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./MessageBank/MessageBank.jsx":7,"./Tree/Tree.jsx":10}],7:[function(require,module,exports){
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
      messageCards.push(React.createElement(MessageCard, {message: _this.state.messageBank[i]}));
    }

    return (
      React.createElement("div", {id: "message-bank"}, 
        React.createElement("button", {onClick: _this.triggerSaveTree}, "Trigger Save"), 
        React.createElement("button", {onClick: _this.downloadTree}, "Download"), 

        React.createElement("form", {
          encType: "multipart/form-data", 
          action: "/files/processedTree", 
          method: "post"}, 
          React.createElement("input", {type: "file", name: "file"}), 
          React.createElement("input", {type: "submit", value: "Submit"})
        ), 

        React.createElement("div", {id: "download-link"}), 
        React.createElement("input", {type: "text", id: "searchbar", placeholder: "Search: "}), 
        React.createElement("div", null, messageCards)
      )
    );
  }
});

module.exports = MessageBank;

},{"./MessageCard.jsx":8}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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
    GlbTreeCtrl.setLogicCard({
      cardID: uuid,
      childrenCardIDs: [],
      parentCardIDs: [],
      speaker: "",
      message: "",
      visible: true,
      highlight: false
    });
  },

  toggleVisibility: function() {
    GlbTreeCtrl.toggleVisibility(_this.state.cardID);
  },

  deleteCard: function() {
    GlbTreeCtrl.deleteLogicCard(_this.state.cardID);
  },

  // Handle collecting information when dropping a card from the messageBank.
  handleDrop: function(ev) {
    ev.preventDefault();
    var _this = this;
    var data;

    try { data = JSON.parse(ev.dataTransfer.getData('text')); }
    catch (e) { return; }

    var card = GlbTreeCtrl.getLogicCard(_this.state.cardID);
    card.message = data.message;
    GlbTreeCtrl.setLogicCard(card);
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
      React.createElement("div", {className: "logic-card-block", id: "testing"}, 
        React.createElement("div", {className: "logic-card", draggable: "true", 
          onDragStart: _this.dragStart, 
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
      )
    );
  }
});

module.exports = LogicCard;

},{"../../ContentEditable.jsx":5}],10:[function(require,module,exports){
var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({displayName: "Tree",

  componentDidMount: function() {
    var _this = this;
    $(GlobalEvents).on('global_tree:changed', function(ev) {
      _this.forceUpdate();
    });
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off('global_tree:changed');
  },

  resetTree: function(childContext) {
    console.log("Resetting the tree.");
    GlbTreeCtrl.resetTree();
  },

  render: function() {
    var _this = this;

    // Draw out all the logic cards from the GlobalTree.
    logicCardViews = {};
    for (i in GlobalTree) {
      logicCardViews[i] = 
        React.createElement(LogicCard, {
          key: GlobalTree[i].cardID, 
          ref: GlobalTree[i].cardID, 
          
          cardID: GlobalTree[i].cardID, 
          childrenCardIDs: GlobalTree[i].childrenCardIDs, 
          parentCardIDs: GlobalTree[i].parentCardIDs, 

          speaker: GlobalTree[i].speaker, 
          message: GlobalTree[i].message}
        )
    }

    return (React.createElement("div", {id: "tree-display"}, logicCardViews));
  }
  
});

module.exports = Tree;

},{"./LogicCard.jsx":9}]},{},[2]);

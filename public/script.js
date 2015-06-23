(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// JQuery.
// Allow draggable windows.
$.fn.attachDragger = function(){
  var attachment = false, lastPosition, position, difference;
  $( $(this).selector ).on("mousedown mouseup mousemove",function(e){
    if( e.type == "mousedown" ) attachment = true, lastPosition = [e.clientX, e.clientY];
    if( e.type == "mouseup" ) attachment = false;
    if( e.type == "mousemove" && attachment == true ){
      position = [e.clientX, e.clientY];
      difference = [ (position[0]-lastPosition[0]), (position[1]-lastPosition[1]) ];
      $(this).scrollLeft( $(this).scrollLeft() - difference[0] );
      $(this).scrollTop( $(this).scrollTop() - difference[1] );
      lastPosition = [e.clientX, e.clientY];
    }
  });

  $(window).on("mouseup", function(){
    attachment = false;
  });
}

module.exports = $.fn.attachDragger;

},{}],2:[function(require,module,exports){
module.exports = function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '_' + s4() + '_' + s4() + '_' +
    s4() + '_' + s4() + s4() + s4();
}

},{}],3:[function(require,module,exports){
require('./dragTree.js');

// React Router requirements.
var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;
var RouteHandler = window.ReactRouter.RouteHandler;

// Global event system.
GlobalEvents = {};

// GUID Generator.
guid = require('./guid.js');

// Utility scripts.
utils = require('./utils.js');
pushIfUnique = utils.pushIfUnique;

var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement(RouteHandler, null)
    );
  }
});

var Editor = require('../jsx/Editor/Editor.jsx');

var routes = (
  React.createElement(Route, {handler: App}, 
    React.createElement(Route, {handler: Editor})
  )
);

// Holder for the processed tree document.
ProcessedTree = {};
$.ajax({
  type: "GET",
  url: "files/input.json",
  dataType: "json",
  success: function(data) {
    ProcessedTree = data;

    Router.run(routes, function (Handler) {
      React.render(React.createElement(Handler, null), document.getElementById('content'));
    });
  }
});

},{"../jsx/Editor/Editor.jsx":6,"./dragTree.js":1,"./guid.js":2,"./utils.js":4}],4:[function(require,module,exports){
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
      cardId: _this.props.cardId || uuid,
      childrenCardIds: [],
      parentCardIds: [],

      visible: true,
      highlight: false,
      speaker: "",
      message: ""
    };
  },

  componentDidMount: function() {
    var _this = this;
    
    // Save current state to the GlobalTree.
    $(GlobalEvents).on('tree:save', function(ev) {
      console.log("tree:save triggered.");
      _this.saveTree();
    });
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off('tree:save');
  },

  preventDefault: function(ev) { ev.preventDefault(); },

  // Creates a new card.
  handleAdd: function() {
    var _this = this;
    var uuid = guid();

    // TODO: Create a new Logic card and save it into the GlobalTree.

    _this.setState(_this.state);
  },

  hideChildren: function() {
    var _this = this;
    _this.state.visible = !_this.state.visible;

    // TODO: Search through the tree and hide all children as well.

    _this.setState(_this.state);
  },

  // Pass the context back to the parent.
  // removeChildCardId does the actual work. This just bridges the command.
  deleteCard: function() {
    // TODO: Remove from Global Tree.
    // Unmount instance of tree from the tree container.
  },

  removeChildCardId: function(childCard) {
    var _this = this;

    // TODO: Remove from childrenCardIds array.

    _this.setState(_this.state);
  },

  // Handle collecting information when dropping a card from the messageBank.
  handleDrop: function(ev) {
    ev.preventDefault();
    var _this = this;
    var data;

    try { data = JSON.parse(ev.dataTransfer.getData('text')); }
    catch (e) { return; }

    _this.state.message = data.message;
    _this.setState(_this.state);
  },

  handleMouseEnter: function(ev) {
    ev.preventDefault();
  },

  handleMouseLeave: function(ev) {
    ev.preventDefault();
  },

  // Manually save contentEditable changes to React state since React doesn't
  // automatically handle this for us.
  handleCEChange: function(ev) {
    var _this = this;
    _this.state[ev.target.sourceState] = ev.target.value;
    _this.setState(_this.state);
  },

  // Save the card into the GlobalTree.
  saveTree: function(ev) {
    var _this = this;

    // TODO: Move this somewhere else besides here.
    GlobalTree[_this.state.cardId] = {
      cardId: _this.state.cardId,
      parentCardIds: _this.state.parentCardIds,
      childrenCardIds: _this.state.childrenCardIds,
      speaker: _this.state.speaker,
      message: _this.state.message
    }
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
        React.createElement("div", {className: "hide-card-button", onClick: _this.hideChildren}, 
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
            React.createElement("div", null, _this.state.cardId), 
            React.createElement("span", null, "Children IDs: "), 
            React.createElement("div", null, _this.state.childrenCardIds), 
            React.createElement("span", null, "Speaker: "), 
            React.createElement(ContentEditable, {html: _this.state.speaker, 
              onChange: _this.handleCEChange, 
              sourceState: "speaker"}), 
            React.createElement("span", null, "Message: "), 
            React.createElement(ContentEditable, {html: _this.state.message, 
              onChange: _this.handleCEChange, 
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
  getInitialState: function() {
    var uuid = guid();
    return {
      uuid: uuid
    };
  },

  resetTree: function(childContext) {
    console.log("Resetting the tree.");
    var _this = this;
    ProcessedTree = {};
    _this.replaceState(_this.getInitialState());
  },

  render: function() {
    var _this = this;
    return (
      React.createElement("div", {id: "tree-display"}, 
        React.createElement(LogicCard, {
          key: _this.state.uuid, 
          ref: _this.state.uuid, 
          cardId: "root", 
          deleteCard: _this.resetTree, 
          onChildCreate: function() {return;}})
      )
    );
  }
});

module.exports = Tree;

},{"./LogicCard.jsx":9}]},{},[3]);

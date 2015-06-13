(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;
var RouteHandler = window.ReactRouter.RouteHandler;

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

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('content'));
});

},{"../jsx/Editor/Editor.jsx":2}],2:[function(require,module,exports){
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

},{"./MessageBank/MessageBank.jsx":3,"./Tree/Tree.jsx":6}],3:[function(require,module,exports){
var MessageCard = require('./MessageCard.jsx');

var MessageBank = React.createClass({displayName: "MessageBank",

  getInitialState: function () {
    return {
      messageBank: {}
    };
  },

  componentDidMount: function() {

    var _this = this;

    // Load message bank data.
    console.log("Component mounted.");

    $.ajax({
      type: "GET",
      url: "files/messages.json",
      dataType: "json",
      success: function(data) {
        console.log("messages.json loaded.");
        // console.log(data);

        _this.setState({
          messageBank: data
        })
        _this.bindSearch();
      },
      error: function() {
        $.ajax({
          type: "GET",
          url: "files/messages.csv",
          dataType: "text",
          success: function(data) {
            console.log("messages.csv loaded.");
            _this.getRandomIDs(data);
          }
        });
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

  getRandomIDs: function(allText) {
    console.log("Getting random IDs.");

    var _this = this;
    var allTextLines = allText.split(/\r\n|\n/);
    var allTextLinesLength = allTextLines.length;

    if (allTextLines.length === 0) { return; }

    var randomOrgRequest = {
      "jsonrpc": "2.0",
      "method": "generateStrings",
      "params": {
        "apiKey": "5b278ac6-92aa-429e-8fda-37bd41245594",
        "n": allTextLinesLength,
        "length": 7,
        "characters": "abcdefghijklmnopqrstuvwxyz",
        "replacement": false
      },
      "id": 18197
    }

    var randomOrgUrl = "https://api.random.org/json-rpc/1/invoke";
    $.post(randomOrgUrl, JSON.stringify(randomOrgRequest), function (data) {

      console.log("Bits used: " + data.result.bitsUsed);
      console.log("Bits left: " + data.result.bitsLeft);
      console.log("Requests left: " +data.result.requestsLeft);

      var randomIDs = data.result.random.data;
      var messagesJson = {};

      for (var i = 0; i < randomIDs.length; i++) {
        messagesJson[ randomIDs[i] ] = allTextLines[i];
      }

      console.log(messagesJson)
      _this.setDownloadLink(messagesJson);
    });
  },

  setDownloadLink: function(messagesJson) {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messagesJson));

    $('<a href="data:' + data + '" download="messages.json">Save and input converted file.</a>').appendTo('#tree-display');
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (var id in _this.state.messageBank) {
      messageCards.push(
        React.createElement(MessageCard, {key: id, cardId: id, 
          message: _this.state.messageBank[id]})
      );
    }

    return (
      React.createElement("div", {id: "message-bank"}, 
        React.createElement("input", {type: "text", id: "searchbar", placeholder: "Search: "}), 
        React.createElement("div", null, messageCards)
      )
    );
  }
  
});

module.exports = MessageBank;

},{"./MessageCard.jsx":4}],4:[function(require,module,exports){
var MessageCard = React.createClass({displayName: "MessageCard",

  componentDidMount: function() {
    // console.log(this.props.cardId);    
  },

  render: function() {
    var _this = this;
    return (
      React.createElement("div", {className: "message-card", draggable: "true"}, 
        React.createElement("i", null, _this.props.cardId), 
        React.createElement("div", null, _this.props.message)
      )
    );
  }
});

module.exports = MessageCard;

},{}],5:[function(require,module,exports){
var LogicCard = React.createClass({displayName: "LogicCard",

  getInitialState: function() {
    return {
      visible: true,
      childLogicCards: []
    };
  },

  handleRightArrow: function() {
    var _this = this;

    // Add a new logic child to the start of the list.
    _this.state.childLogicCards.unshift(
      React.createElement(LogicCard, {card: {}})
    );

    _this.setState(_this.state);
  },

  hideChildren: function() {
    var _this = this;

    _this.state.visible = !_this.state.visible;
    console.log(_this.state.visible);
    _this.setState(_this.state);

  },

  handleDrop: function(e) {
    e.preventDefault();
    var data = e.data;
  },

  render: function() {
    var _this = this;

    var newOrAddButton;
    var hideButton;
    var deleteButton;

    var childrenTreeStyle;
    var hideButtonStyle;

    if (_this.state.visible === true) {
      
      childrenTreeStyle = classNames({
        'tree-new-level': true,
        'hide': false
      });

      hideButtonStyle = classNames({
        'fa': true,
        'fa-bookmark': true,
        'fa-bookmark-o': false
      });
      
    } else {

      childrenTreeStyle = classNames({
        'tree-new-level': true,
        'hide': true
      });

      hideButtonStyle = classNames({
        'fa': true,
        'fa-bookmark': false,
        'fa-bookmark-o': true
      });

    }

    if (_this.state.childLogicCards.length  === 0) {
      newOrAddButton = React.createElement("i", {className: "fa fa-arrow-right"});

      hideButton = React.createElement("div", null);

    } else {
      newOrAddButton = React.createElement("i", {className: "fa fa-plus"});

      hideButton = (
        React.createElement("div", {className: "hide-card-button", onClick: this.hideChildren}, 
          React.createElement("i", {className: hideButtonStyle})
        )
      );
    }

    deleteButton = (
      React.createElement("div", {className: "delete-card-button", 
        onClick: this.deleteCard}, 
        React.createElement("i", {className: "fa fa-times"})
      )
    );

    return (
      React.createElement("div", {className: "logic-card-block", id: "testing", onDrop: this.handleDrop}, 
        React.createElement("div", {className: "logic-card"}, 
          React.createElement("div", {className: "logic-card-content"}, 
            React.createElement("span", null, "Parent ID: "), 
            React.createElement("div", {contentEditable: "true"}), 
            React.createElement("span", null, "ID: "), 
            React.createElement("div", {contentEditable: "true"}), 
            React.createElement("span", null, "Speaker: "), 
            React.createElement("div", {contentEditable: "true"}), 
            React.createElement("span", null, "Message: "), 
            React.createElement("div", {contentEditable: "true"}), 

            React.createElement("div", {className: "card-buttons-container"}, 
              React.createElement("div", {className: "add-card-button", onClick: this.handleRightArrow}, 
                newOrAddButton
              ), 

              hideButton, 
              deleteButton

            )
          )
        ), 

        React.createElement("div", {className: childrenTreeStyle}, 
          _this.state.childLogicCards
        )

      )
    );
  }
});

module.exports = LogicCard;

},{}],6:[function(require,module,exports){
var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({displayName: "Tree",

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var _this = this;

    return (
      React.createElement("div", {id: "tree-display"}, 
        React.createElement(LogicCard, {card: {}})
      )
    );
  }

});

module.exports = Tree;

},{"./LogicCard.jsx":5}]},{},[1]);

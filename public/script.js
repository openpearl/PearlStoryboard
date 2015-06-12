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
        React.createElement("input", {type: "text", id: "searchbar"}), 
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

  handleAddClick: function() {
    // this.props.onAddClick(this);

    console.log("Handling the click in Logic card.");

    var _this = this;
    _this.state.childLogicCards.push(
      React.createElement(LogicCard, {card: {}})
    );

    this.setState(_this.state);
  },

  handleDrop: function(e) {
    e.preventDefault();
    var data = e.data;
  },

  componentDidMount: function() {

    // Draws a line.
    // $('#testing').line(0, 0, 20, 20);    
  
  },

  render: function() {
    var _this = this;

    if (this.props.card.childLogicCards != null) {
      _this.state.childLogicCards = this.props.card.childLogicCards.map(
        function(card, index) {
          return React.createElement(LogicCard, {key: index, card: card})
      });

      _this.setState(_this.state);

    }

    return (
      React.createElement("div", {className: "logic-card-block", id: "testing", onDrop: this.handleDrop}, 
        
        React.createElement("div", {className: "logic-card"}, 
          React.createElement("span", null, "Parent ID: "), 
          React.createElement("div", {contentEditable: "true"}), 
          React.createElement("span", null, "ID: "), 
          React.createElement("div", {contentEditable: "true"}), 
          React.createElement("span", null, "Speaker: "), 
          React.createElement("div", {contentEditable: "true"}), 
          React.createElement("span", null, "Message: "), 
          React.createElement("div", {contentEditable: "true"})
        ), 

        React.createElement("div", {className: "add-card-right", onClick: this.handleAddClick}, 
          React.createElement("i", {className: "fa fa-arrow-right"})
        ), 

        React.createElement("div", {className: "add-card-down", onClick: this.handleAddClick}, 
          React.createElement("i", {className: "fa fa-arrow-down"})
        ), 

        React.createElement("div", {className: "tree-new-level"}, 
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
        React.createElement(LogicCard, {card: {}, onAddClick: _this.handleAddClick})
      )
    );
  }

});

module.exports = Tree;

},{"./LogicCard.jsx":5}]},{},[1]);

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;

var App = require('../jsx/App.jsx');
var Tree = require('../jsx/Message/Tree.jsx');

var routes = (
  React.createElement(Route, {handler: App}, 
    React.createElement(Route, {handler: Tree})
  )
);

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.getElementById('content'));
});

},{"../jsx/App.jsx":2,"../jsx/Message/Tree.jsx":4}],2:[function(require,module,exports){
var RouteHandler = window.ReactRouter.RouteHandler;

var App = React.createClass({displayName: "App",
  render: function() {
    return (
      React.createElement(RouteHandler, null)
    );
  }
});

module.exports = App;

},{}],3:[function(require,module,exports){
var MessageBank = React.createClass({displayName: "MessageBank",

  getInitialState: function () {
    return {
      messageBank: []
    };
  },

  componentDidMount: function() {

    var _this = this;

    // Load message bank data.
    $.ajax({
      type: "GET",
      url: "files/messages.csv",
      dataType: "text",
      success: function(data) {
        _this.processData(data);
        _this.bindSearch();
      }
    });

  },

  processData: function(allText) {
    var _this = this;
    var allTextLines = allText.split(/\r\n|\n/);

    _this.state.messageBank = allTextLines;
    this.setState(_this.state.messageBank);
  },

  bindSearch: function() {

    $messages = $(".message-card");

    $('#searchbar').keyup(function() {
      var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
      console.log(val);
      
      $messages.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
      }).hide();
    });
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (i = 0; i < _this.state.messageBank.length; i++) {
      messageCards.push(
        React.createElement("div", {className: "message-card"}, 
          _this.state.messageBank[i]
        )
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

},{}],4:[function(require,module,exports){
var MessageBank = require("./MessageBank.jsx");

var Tree = React.createClass({displayName: "Tree",

  render: function() {
    return (
      React.createElement("div", null, 
        React.createElement(MessageBank, null)
      )
    );
  }

});

module.exports = Tree;

},{"./MessageBank.jsx":3}]},{},[1]);

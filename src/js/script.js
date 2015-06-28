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

var App = React.createClass({
  render: function() {
    return (
      <RouteHandler/>
    );
  }
});

var routes = (
  <Route handler={App}>
    <Route handler={Editor} />
  </Route>
);

// Start rendering React only when documents have been loaded.
refreshTreeView = function() {
  $.ajax({
    type: "GET",
    url: "files/input.json",
    dataType: "json",
    success: function(data) {
      GTC.setTree(data).refresh();
      Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.getElementById('content'));
      });
    }
  });
}

refreshTreeView();
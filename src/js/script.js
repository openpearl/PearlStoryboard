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
$.ajax({
  type: "GET",
  url: "files/input.json",
  dataType: "json",
  success: function(data) {
    GlbTreeCtrl.setTree(data);

    Router.run(routes, function (Handler) {
      React.render(<Handler/>, document.getElementById('content'));
    });
  }
});

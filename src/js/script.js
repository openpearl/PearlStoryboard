require('./dragTree.js');

// React Router requirements.
var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;
var RouteHandler = window.ReactRouter.RouteHandler;

// Global event system.
GlobalEvents = {};

var App = React.createClass({
  render: function() {
    return (
      <RouteHandler/>
    );
  }
});

var Editor = require('../jsx/Editor/Editor.jsx');

var routes = (
  <Route handler={App}>
    <Route handler={Editor} />
  </Route>
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
      React.render(<Handler/>, document.getElementById('content'));
    });
  }
});

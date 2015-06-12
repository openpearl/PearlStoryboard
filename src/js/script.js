var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;
var RouteHandler = window.ReactRouter.RouteHandler;

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

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});

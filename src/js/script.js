var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;

var App = require('../jsx/App.jsx');
var Tree = require('../jsx/Message/Tree.jsx');

var routes = (
  <Route handler={App}>
    <Route handler={Tree} />
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.getElementById('content'));
});

// React Router requirements.
var Router = window.ReactRouter;
var Route = window.ReactRouter.Route;
var RouteHandler = window.ReactRouter.RouteHandler;
var Editor = require('./components/Editor/Editor.jsx');

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
var refreshTreeView = function() {
  var data;
  $.ajax({
    type: "GET",
    url: "files/input.json",
    dataType: "json",
    success: function(_data) {
      data = _data;
      // console.log(typeof data);
      // console.log(data);
      if (data === null) {
        data = CardSchema;        
      }

      GTC.setTree(data).refresh();
      Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.getElementById('content'));
      });
    },
    error: function(_error) {
      data = CardSchema;
      GTC.setTree(data).refresh();
      Router.run(routes, function (Handler) {
        React.render(<Handler/>, document.getElementById('content'));
      });
      console.log(_error);
    }
  });
}

refreshTreeView();

// FIXME: Auto-save when the browser closes.
// var has_disconnected = false;
// $(window).bind('beforeunload', function() {
//   while (!has_disconnected) {
//     GTC.saveTree();
//     return true;
//   }
// });

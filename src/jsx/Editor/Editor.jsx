var Sidebar = require("./Sidebar/Sidebar.jsx");
var Tree = require("./Tree/Tree.jsx");

var Editor = React.createClass({

  render: function() {
    return (
      <div id="editor-page">
        <Sidebar />
        <Tree />
      </div>
    );
  }

});

module.exports = Editor;

var MessageBank = require("./MessageBank/MessageBank.jsx");
var Tree = require("./Tree/Tree.jsx");

var Editor = React.createClass({

  render: function() {
    return (
      <div id="editor-page">
        <MessageBank />
        <Tree />
      </div>
    );
  }

});

module.exports = Editor;

var ContentEditor = React.createClass({

  render: function() {
    return (
      <div id="content-editor">
        <div id="ce-speaker" contentEditable></div>
        <div id="ce-message" contentEditable></div>
      </div>
    );
  }

});

module.exports = ContentEditor;

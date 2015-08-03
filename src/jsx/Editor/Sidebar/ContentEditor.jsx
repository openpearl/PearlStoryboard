var editor = {};
var ContentEditorSchema = {
  "title": "Card Editor",
  "type": "object",
  "properties": {
    "speaker": {
      "type": "string"
    },
        "filters": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "cardBody": {
      "type": "object",
      "properties": {
        "messages": {
          "type": "array",
          "items": {
            "type": "string"
          }
        }
      }
    }
  }
};

var ContentEditor = React.createClass({

  getInitialState: function() {
    return CardSchema;
  },

  componentDidMount: function() {
    var _this = this;

    var editorElement = document.getElementById('content-editor');
    var editorOptions = {
      schema: ContentEditorSchema,
      iconlib: "fontawesome4"
    };

    editor = new JSONEditor(editorElement, editorOptions);
    editor.disable();

    $(GlobalEvents).on("card:selected", function(ev, cardID) {
      console.log(cardID + " clicked.");
      editor.enable();
      _this.state = GTC.getLogicCard(cardID);
      _this._populateEditor(_this.state);      
      _this.setState(_this.state);
    });

    // Keyboard enter.
    // $(editorElement).bind("keypress", function(e) {
    // editor.on("change", function() {
    //   console.log(e);
    //   var code = e.keyCode || e.which;
    //   if (e.keyCode === 13) {
    //     console.log("Enter pressed.");
    //     _this._saveEditor();
    //   }
    // });
  },

  componentWillUnmount: function() {
    editor.destroy();
    $(GlobalEvents).off("card:selected");
  },

  _populateEditor: function(card) {
    // TODO: This code isn't DRY.
    var _this = this;

    var speaker = editor.getEditor('root.speaker');
    var cardBody = editor.getEditor('root.cardBody');
    var filters = editor.getEditor('root.filters');

    speaker.setValue(card.speaker);
    cardBody.setValue(card.cardBody);
    filters.setValue(card.filters);

    _this.state.cardID = card.cardID;
    _this.setState(_this.state);
  },

  _saveEditor: function(ev) {
    var _this = this;

    console.log("Saving the content in the editor.");
    var contentSnapshot = editor.getValue();
    console.log(contentSnapshot);

    contentSnapshot.cardID = _this.state.cardID;
    GTC.setLogicCard(contentSnapshot).refresh();
  },

  render: function() {
    var _this = this;

    return (
      <div>
        <div id="content-editor"></div>
        <button id="content-editor-submit" onClick={_this._saveEditor}>
          Submit
        </button>
      </div>
    );
  }
});

module.exports = ContentEditor;

var editor = {};
var ContentEditorSchema = {
  "title": "Card Editor",
  "type": "object",
  "properties": {
    "speaker": {
      "type": "string"
    },
    "cardType": {
      "type": "string"
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
    },
    "filters": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "inputs": {
      "type": "array",
      "items": {
        "type": "string"
      }
    },
    "methods": {
      "type": "array",
      "items": {
        "type": "string"
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
    $(editorElement).bind("keypress", function(e) {
      var code = e.keyCode || e.which;
      if (e.keyCode === 13) {
        console.log("Enter pressed.");
        // Need a timeout to allow for saving first.
        setTimeout(_this._saveEditor, 1);
      }
    });
  },

  componentWillUnmount: function() {
    editor.destroy();
    $(GlobalEvents).off("card:selected");
  },

  _populateEditor: function(card) {
    // TODO: This code isn't DRY.
    var _this = this;

    var speaker = editor.getEditor('root.speaker');
    var cardType = editor.getEditor('root.cardType');
    var cardBody = editor.getEditor('root.cardBody');
    var filters = editor.getEditor('root.filters');
    var inputs = editor.getEditor('root.inputs');
    var methods = editor.getEditor('root.methods');

    speaker.setValue(card.speaker);
    cardType.setValue(card.cardType);
    cardBody.setValue(card.cardBody);
    filters.setValue(card.filters);
    inputs.setValue(card.inputs);
    methods.setValue(card.methods);

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
      <div id="content-editor"></div>
    );
  }
});

module.exports = ContentEditor;

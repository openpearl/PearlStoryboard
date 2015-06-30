var ContentEditor = React.createClass({

  getInitialState: function() {
    return {
      cardID: "",
      speaker: "",
      messages: "",

      // These are strings because constant conversion is excessive.
      // Conversion is done later at the save.
      tagnames: "",
      conditionals: "",
    };
  },


  componentDidMount: function() {
    var _this = this;
    $(GlobalEvents).on("card:selected", function(ev, cardID) {
      console.log(cardID + " clicked.");

      var currentCard = GTC.getLogicCard(cardID);
      _this.state.cardID = cardID;
      _this.state.speaker = currentCard.speaker;
      _this.state.messages = currentCard.messages;

      _this.setState(_this.state);
    });
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off("card:selected");
  },

  handleFormChange: function(ev) {
    var _this = this;
    var chosenSource = ev.target.getAttribute("data-source");
    _this.state[chosenSource] = ev.target.value;
    _this.setState(_this.state);
  },

  handleSubmit: function(ev) {
    ev.preventDefault();
    var _this = this;
    console.log("Submitting.");

    // Convert the conditionals and tagnames into arrays.
    if (_this.state.conditionals.splice) {
      _this.state.conditionals = _this.state.conditionals.splice(',');
    }

    if (_this.state.tagnames.splice) {
      _this.state.tagnames = _this.state.tagnames.splice(',');
    }

    // Save the data to the tree.
    GTC.setLogicCard(_this.state).done(function(){
      $(GlobalEvents).trigger(_this.state.cardID + ":changed");
    });
  },

  render: function() {
    var _this = this;

    return (
      <form id="content-editor" onSubmit={_this.handleSubmit}>
        
        <span>Speaker: </span>
        <textarea id="ce-speaker"
          data-source="speaker" 
          value={_this.state.speaker}
          onChange={_this.handleFormChange}></textarea>
        
        <span>Messages: </span>
        <textarea id="ce-messages" 
          data-source="messages"
          value={_this.state.messages}
          onChange={_this.handleFormChange}></textarea>
        
        <span>Tagnames: </span>
        <textarea id="ce-tagnames" 
          data-source="tagnames"
          value={_this.state.tagnames}
          onChange={_this.handleFormChange}></textarea>

        <span>Conditionals: </span>
        <textarea id="ce-conditionals" 
          data-source="conditionals"
          value={_this.state.conditionals}
          onChange={_this.handleFormChange}></textarea>

        <input type="submit"></input> 
      </form>
    );
  }
});

module.exports = ContentEditor;

var ContentEditor = React.createClass({

  getInitialState: function() {
    return {
      cardID: "",
      speaker: "",
      message: ""
    };
  },


  componentDidMount: function() {
    var _this = this;
    $(GlobalEvents).on("card:selected", function(ev, cardID) {
      console.log(cardID + " clicked.");

      var currentCard = GTC.getLogicCard(cardID);
      _this.state.cardID = cardID;
      _this.state.speaker = currentCard.speaker;
      _this.state.message = currentCard.message;

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

    // Save the data to the tree.
    GTC.setLogicCard(_this.state);
  },

  render: function() {
    var _this = this;

    return (
      <form id="content-editor" onSubmit={_this.handleSubmit}>
        <span>Speaker: </span>
        <input id="ce-speaker"
          data-source="speaker" 
          value={_this.state.speaker}
          onChange={_this.handleFormChange}></input>
        <span>Message: </span>
        <input id="ce-message" 
          data-source="message"
          value={_this.state.message}
          onChange={_this.handleFormChange}></input>
        <input type="submit"></input> 
      </form>
    );
  }

});

module.exports = ContentEditor;

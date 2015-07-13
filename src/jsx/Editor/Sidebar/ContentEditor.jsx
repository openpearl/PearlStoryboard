var ContentEditor = React.createClass({

  getInitialState: function() {
    return CardSchema;
  },


  componentDidMount: function() {
    var _this = this;
    $(GlobalEvents).on("card:selected", function(ev, cardID) {
      console.log(cardID + " clicked.");

      _this.state = GTC.getLogicCard(cardID);
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

    console.log(_this.state[chosenSource]);
    _this.setState(_this.state);
  },

  handleSubmit: function(ev) {
    ev.preventDefault();
    var _this = this;
    console.log("Submitting.");

    // Convert the filters into arrays.
    if (_this.state.filters.splice) {
      _this.state.filters = _this.state.filters.splice(',');
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
        
        <span>Filters: </span>
        <textarea id="ce-filters" 
          data-source="filters"
          value={_this.state.filters}
          onChange={_this.handleFormChange}></textarea>

        <input type="submit"></input> 
      </form>
    );
  }
});

module.exports = ContentEditor;

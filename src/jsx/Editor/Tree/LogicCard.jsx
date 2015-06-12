var LogicCard = React.createClass({

  getInitialState: function() {
    return {
      visible: true,
      childLogicCards: []
    };
  },

  handleAddClick: function() {
    // this.props.onAddClick(this);

    console.log("Handling the click in Logic card.");

    var _this = this;
    _this.state.childLogicCards.push(
      <LogicCard card={{}} />
    );

    this.setState(_this.state);
  },

  handleDrop: function(e) {
    e.preventDefault();
    var data = e.data;
  },

  componentDidMount: function() {

    // Draws a line.
    // $('#testing').line(0, 0, 20, 20);    
  
  },

  render: function() {
    var _this = this;

    if (this.props.card.childLogicCards != null) {
      _this.state.childLogicCards = this.props.card.childLogicCards.map(
        function(card, index) {
          return <LogicCard key={index} card={card} />
      });

      _this.setState(_this.state);

    }

    return (
      <div className="logic-card-block" id="testing" onDrop={this.handleDrop}>
        
        <div className="logic-card">
          <span>Parent ID: </span>
          <div contentEditable='true'></div>
          <span>ID: </span>
          <div contentEditable='true'></div>
          <span>Speaker: </span>
          <div contentEditable='true'></div>
          <span>Message: </span>
          <div contentEditable='true'></div>
        </div>

        <div className="add-card-right" onClick={this.handleAddClick}>
          <i className="fa fa-arrow-right"></i>
        </div>

        <div className="add-card-down" onClick={this.handleAddClick}>
          <i className="fa fa-arrow-down"></i>
        </div>

        <div className="tree-new-level">
          {_this.state.childLogicCards}
        </div>

      </div>
    );
  }

});

module.exports = LogicCard;

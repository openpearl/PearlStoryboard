var LogicCard = React.createClass({

  getInitialState: function() {
    return {
      visible: true,
      childLogicCards: []
    };
  },

  handleRightArrow: function() {
    var _this = this;

    // Add a new logic child to the start of the list.
    _this.state.childLogicCards.unshift(
      <LogicCard card={{}}/>
    );

    _this.setState(_this.state);
  },

  handlePlusSibling: function() {
    console.log("Handling the down arrow.");
    console.log(this.props);
  },

  handleDrop: function(e) {
    e.preventDefault();
    var data = e.data;
  },

  render: function() {
    var _this = this;

    // Choose which button to use.
    var newOrAddButton;
    if (_this.state.childLogicCards.length  === 0) {
      newOrAddButton = <i className="fa fa-arrow-right"></i>;
    } else {
      newOrAddButton = <i className="fa fa-plus"></i>;
    }

    return (
      <div className="logic-card-block" id="testing" onDrop={this.handleDrop}>
        <div className="logic-card">
          <div className="logic-card-content">
            <span>Parent ID: </span>
            <div contentEditable='true'></div>
            <span>ID: </span>
            <div contentEditable='true'></div>
            <span>Speaker: </span>
            <div contentEditable='true'></div>
            <span>Message: </span>
            <div contentEditable='true'></div>

            <div className="add-card-button" onClick={this.handleRightArrow}>
              {newOrAddButton}
            </div>
          </div>
        </div>

        <div className="tree-new-level">
          {_this.state.childLogicCards}
        </div>
      </div>
    );
  }

});

module.exports = LogicCard;

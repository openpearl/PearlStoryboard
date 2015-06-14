var LogicCard = React.createClass({

  getInitialState: function() {
    return {
      visible: true,
      cardId: "",
      parentCardId: "",
      speaker: "",
      message: "",
      childLogicCards: {}
    };
  },

  handleAdd: function() {
    var _this = this;
    var uniqueDateKey = Date.now();

    // Add a new logic child to the start of the list.
    _this.state.childLogicCards[uniqueDateKey] = (
      <LogicCard card={{}}
        key={uniqueDateKey} 
        childCardId={uniqueDateKey}
        deleteCard={_this.deleteChildCard}/>
    );

    _this.setState(_this.state);
  },

  hideChildren: function() {
    var _this = this;

    _this.state.visible = !_this.state.visible;
    _this.setState(_this.state);
  },

  // Pass the context back to the parent.
  deleteCard: function() {
    this.props.deleteCard(this);
  },

  deleteChildCard: function(childCard) {
    var _this = this;

    delete _this.state.childLogicCards[childCard.props.childCardId]; 
    _this.setState(_this.state);
  },

  handleDrop: function(ev) {
    var _this = this;
    ev.preventDefault();

    var data;

    try {
      data = JSON.parse(ev.dataTransfer.getData('text'));
    } catch (e) {
      // If the text data isn't parsable we'll just ignore it.
      return;
    }

    // Do something with the data.
    console.log(data);




  },

  render: function() {
    var _this = this;

    var newOrAddButton;
    var hideButton;
    var deleteButton;

    var childrenTreeStyle;
    var hideButtonStyle;

    // Toggle depending on visibility.
    if (_this.state.visible === true) {
      childrenTreeStyle = classNames({
        'tree-new-level': true,
        'hide': false
      });
      hideButtonStyle = classNames({
        'fa': true,
        'fa-bookmark': true,
        'fa-bookmark-o': false
      });
    } else {
      childrenTreeStyle = classNames({
        'tree-new-level': true,
        'hide': true
      });
      hideButtonStyle = classNames({
        'fa': true,
        'fa-bookmark': false,
        'fa-bookmark-o': true
      });
    }

    // Toggle if there are any child logic cards.
    if ($.isEmptyObject(_this.state.childLogicCards)) {
      newOrAddButton = <i className="fa fa-arrow-right"></i>;
      hideButton = <div></div>;
    } else {
      newOrAddButton = <i className="fa fa-plus"></i>;
      hideButton = (
        <div className="hide-card-button" onClick={this.hideChildren}>
          <i className={hideButtonStyle}></i>
        </div>
      );
    }

    return (
      <div className="logic-card-block" id="testing">
        <div className="logic-card">
          <div className="logic-card-content" onDrop={this.handleDrop}>
            <span>Parent ID: </span>
            <div contentEditable='true'></div>
            <span>ID: </span>
            <div contentEditable='true'></div>
            <span>Speaker: </span>
            <div contentEditable='true'></div>
            <span>Message: </span>
            <div contentEditable='true'></div>

            <div className="card-buttons-container">
              <div className="add-card-button" onClick={this.handleAdd}>
                {newOrAddButton}
              </div>

              {hideButton}

              <div className="delete-card-button" 
                onClick={_this.deleteCard}>
                <i className="fa fa-times"></i>
              </div>

            </div>
          </div>
        </div>

        <div className={childrenTreeStyle}>
          {_this.state.childLogicCards}
        </div>

      </div>
    );
  }
});

module.exports = LogicCard;

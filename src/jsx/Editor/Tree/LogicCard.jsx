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

  hideChildren: function() {
    var _this = this;

    _this.state.visible = !_this.state.visible;
    console.log(_this.state.visible);
    _this.setState(_this.state);

  },

  handleDrop: function(e) {
    e.preventDefault();
    var data = e.data;
  },

  render: function() {
    var _this = this;

    var newOrAddButton;
    var hideButton;
    var deleteButton;

    var childrenTreeStyle;
    var hideButtonStyle;

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

    if (_this.state.childLogicCards.length  === 0) {
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

    deleteButton = (
      <div className="delete-card-button" 
        onClick={this.deleteCard}>
        <i className="fa fa-times"></i>
      </div>
    );

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

            <div className="card-buttons-container">
              <div className="add-card-button" onClick={this.handleRightArrow}>
                {newOrAddButton}
              </div>

              {hideButton}
              {deleteButton}

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

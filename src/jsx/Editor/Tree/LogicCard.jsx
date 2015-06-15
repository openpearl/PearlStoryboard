var LogicCard = React.createClass({

  getInitialState: function() {
    var _this = this;

    return {
      visible: true,
      cardId: "",
      parentCardId: _this.props.parentCardId,
      childrenCards: {},
      speaker: "",
      message: ""
    };
  },

  componentDidMount: function() {
    var _this = this;
    $(GlobalEvents).on('tree:save', function(ev) {
      console.log("Event triggered.");
      _this.saveTree();
    });
  },

  componentWillReceiveProps: function(nextProps) {
    var _this = this;    

    if (nextProps.parentCardId) {
      _this.state.parentCardId = nextProps.parentCardId;
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    var _this = this;

    // Update children to have parentCardId.
    for (cardIndex in _this.state.childrenCards) {
      _this.state.childrenCards[cardIndex].parentCardId = nextState.cardId;
    }

    // Update parent to have childId.
    _this.props.onChildCreate(_this);
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off('tree:save');
  },

  preventDefault: function(ev) {
    ev.preventDefault();
  },

  handleAdd: function() {
    var _this = this;
    var uniqueDateKey = Date.now();

    _this.state.childrenCards[uniqueDateKey] = {
      key: uniqueDateKey,
      cardId: "",
      parentCardId: _this.state.cardId
    };

    _this.setState(_this.state);
  },

  handleChildCreate: function(childContext) {
    var _this = this;
    console.log("Handle child create: ");
    console.log(childContext);

    console.log(childContext.props.cardKey);
    console.log(childContext.state.cardId);

    var childCardKey = childContext.props.cardKey;
    var childContextId = childContext.state.cardId;

    if (_this.state.childrenCards[childCardKey].cardId !== childContextId) {
      _this.state.childrenCards[childCardKey].cardId = childContextId;
      _this.setState(_this.state);
    }
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
    delete _this.state.childrenCards[childCard.props.cardKey]; 
    _this.setState(_this.state);
  },

  handleDrop: function(ev) {
    ev.preventDefault();
    var _this = this;
    var data;

    try { data = JSON.parse(ev.dataTransfer.getData('text')); }
    catch (e) { return; }
    _this.state.cardId = data.bankCardId;
    _this.state.message = data.message;
    _this.setState(_this.state);
  },

  saveTree: function(ev) {
    var _this = this;

    ProcessedTree[_this.state.cardId] = {
      cardId: _this.state.cardId,
      parentCardId: _this.state.parentCardId,
      speaker: _this.state.speaker,
      message: _this.state.message
    }
  },

  render: function() {
    var _this = this;

    var newOrAddButton;
    var hideButton;
    var deleteButton;

    var childrenTreeStyle;
    var hideButtonStyle;

    var childrenCardViews = {};
    var childrenCardIds = [];

    for (childIndex in _this.state.childrenCards) {
      childrenCardViews[childIndex] = (
        <LogicCard
          key={_this.state.childrenCards[childIndex].key}
          ref={_this.state.childrenCards[childIndex].key}
          cardKey={_this.state.childrenCards[childIndex].key}
          parentCardId={_this.state.cardId} 
          deleteCard={_this.deleteChildCard}
          onChildCreate={_this.handleChildCreate}
        />
      );

      // Display the list of child IDs.
      childrenCardIds.push(_this.state.childrenCards[childIndex].cardId);
    }

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
    if ($.isEmptyObject(_this.state.childrenCards)) {
      newOrAddButton = <i className="fa fa-arrow-right"></i>;
      hideButton = <div></div>;
    } else {
      newOrAddButton = <i className="fa fa-plus"></i>;
      hideButton = (
        <div className="hide-card-button" onClick={_this.hideChildren}>
          <i className={hideButtonStyle}></i>
        </div>
      );
    }

    return (
      <div className="logic-card-block" id="testing" >
        <div className="logic-card">
          <div className="logic-card-content" 
            onDragOver={_this.preventDefault}
            onDrop={_this.handleDrop}>
            <span>Parent ID: </span>
            <div contentEditable='true'>{_this.state.parentCardId}</div>
            <span>ID: </span>
            <div contentEditable='true'>{_this.state.cardId}</div>
            <span>Children IDs: </span>
            <div contentEditable='true'>{childrenCardIds}</div>
            <span>Speaker: </span>
            <div contentEditable='true'>{_this.state.speaker}</div>
            <span>Message: </span>
            <div contentEditable='true'>{_this.state.message}</div>

            <div className="card-buttons-container">
              <div className="add-card-button" onClick={_this.handleAdd}>
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
          {childrenCardViews}
        </div>

      </div>
    );
  }
});

module.exports = LogicCard;

var ContentEditable = require('../../ContentEditable.jsx');

var LogicCard = React.createClass({

  getInitialState: function() {
    var _this = this;

    return {
      visible: true,
      cardId: "",
      parentCardId: _this.props.parentCardId,
      childrenCards: {},
      childrenCardIds: [], // For easy reference later on.
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

    // Updates the parentCardId property if the parent gets new ID.
    if (nextProps.parentCardId) {
      _this.state.parentCardId = nextProps.parentCardId;
      _this.setState(_this.state);
    }
  },

  componentWillUpdate: function(nextProps, nextState) {
    var _this = this;

    // Update children to have parentCardId.
    for (cardIndex in _this.state.childrenCards) {
      _this.state.childrenCards[cardIndex].parentCardId = nextState.cardId;

      // Add to child id list if it's not present.
      // FIXME: This seems buggy as you can add more than one child
      // and never be able to remove them.
      console.log(_this.state.childrenCardIds
        .indexOf(_this.state.childrenCards[cardIndex].cardId));
      if (_this.state.childrenCardIds
        .indexOf(_this.state.childrenCards[cardIndex].cardId) <= 1) {
        _this.state.childrenCardIds
          .push(_this.state.childrenCards[cardIndex].cardId);
      }
    }

    // TODO: Figure out what this for loop does.
    for (var i = 0; i < _this.state.childrenCardIds.length; i++) {
      if (_this.state.childrenCardIds[i] === "") {
        _this.state.childrenCardIds.splice(i, 1);
      }
    }

    // Update parent to have childCardId.
    _this.props.onChildCreate(_this);
  },

  componentWillUnmount: function() {
    // Make sure to remove any bound event listeners.
    $(GlobalEvents).off('tree:save');
  },

  preventDefault: function(ev) {
    ev.preventDefault();
  },

  // Creates a new card.
  handleAdd: function() {
    var _this = this;
    var uniqueDateKey = Date.now();

    _this.state.childrenCards[uniqueDateKey] = {
      // The key is important for React.
      // It also helps us identify cards who don't have an assigned cardId yet.
      key: uniqueDateKey,
      cardId: "",
      parentCardId: _this.state.cardId
    };

    _this.setState(_this.state);
  },

  handleChildCreate: function(childContext) {
    var _this = this;

    var childCardKey = childContext.props.cardKey;
    var childContextId = childContext.state.cardId;

    // TODO: Figure out what this if statement does.
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
  // deleteChildCard does the actual work. This just bridges the command.
  deleteCard: function() {
    this.props.deleteCard(this);
  },

  deleteChildCard: function(childCard) {
    var _this = this;
    delete _this.state.childrenCards[childCard.props.cardKey]; 
    _this.setState(_this.state);
  },

  // Handle collecting information when dropping a card from the messageBank.
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

  // Manually save contentEditable changes to React state since React doesn't
  // automatically handle this for us.
  handleCEChange: function(ev) {
    var _this = this;
    _this.state[ev.target.sourceState] = ev.target.value;
    _this.setState(_this.setState);
  },

  // Save the card into the ProcessedTree.
  saveTree: function(ev) {
    var _this = this;

    // TODO: Naive and requires cleanup in the future.
    var uniqueArray = [];
    uniqueArray = _this.state.childrenCardIds.filter(function(item, pos) {
      return _this.state.childrenCardIds.indexOf(item) == pos;
    });
    _this.state.childrenCardIds = uniqueArray;

    ProcessedTree[_this.state.cardId] = {
      cardId: _this.state.cardId,
      parentCardId: _this.state.parentCardId,
      childrenCardIds: _this.state.childrenCardIds,
      speaker: _this.state.speaker,
      message: _this.state.message
    }
  },

  // Manually add a ChildCardId if multiple parents point to one child.
  addChildId: function() {
    var _this = this;
    var newChildId = window.prompt("Add a child ID:");
    _this.state.childrenCardIds.push(newChildId);
    _this.setState(_this.state);
  },

  render: function() {
    var _this = this;

    var newOrAddButton;
    var hideButton;
    var deleteButton;

    var childrenTreeStyle;
    var hideButtonStyle;

    var childrenCardViews = {};

    // Produce the nested child LogicCards.
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
    }

    // Toggle depending on visibility.
    // TODO: Package or shorten for cleaner code.
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
            <div>{_this.state.parentCardId}</div>
            <span>ID: </span>
            <div>{_this.state.cardId}</div>
            <span onClick={_this.addChildId}>Children IDs: </span>
            <div>{_this.state.childrenCardIds}</div>
            <span>Speaker: </span>
            <ContentEditable html={_this.state.speaker} 
              onChange={_this.handleCEChange}
              sourceState="speaker" />
            <span>Message: </span>
            <ContentEditable html={_this.state.message} 
              onChange={_this.handleCEChange}
              sourceState="message" />
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

var ContentEditable = require('../../ContentEditable.jsx');

var LogicCard = React.createClass({

  getInitialState: function() {
    var _this = this;
    var uuid = guid();

    return {
      cardId: _this.props.cardId || uuid,
      childrenCardIds: [], // For easy reference later on.
      childrenCards: {},

      visible: true,
      highlight: false,
      speaker: "",
      message: ""
    };
  },

  componentWillMount: function() {
    var _this = this;

    // Exit if not found in ProcessedTree.
    if (ProcessedTree[_this.state.cardId] === undefined) { return; }
    
    // Now load the children of the card from the ProcessedTree.
    var childrenCardIds = ProcessedTree[_this.state.cardId].childrenCardIds;
    for (i in childrenCardIds) {
      var uuid = guid();
      _this.state.childrenCards[uuid] = {
        cardId: childrenCardIds[i]
      };
    }

    // Now merge the current state with ProcessedTree.
    for (var attrname in ProcessedTree[_this.state.cardId]) {
      _this.state[attrname] = ProcessedTree[_this.state.cardId][attrname];
    }

    _this.setState(_this.state);
  },

  componentDidMount: function() {
    var _this = this;
    
    // Save current state to the ProcessedTree.
    $(GlobalEvents).on('tree:save', function(ev) {
      console.log("tree:save triggered.");
      _this.saveTree();
    });
  },

  componentWillUpdate: function(nextProps, nextState) {
    var _this = this;

    // Update parent to have new children not created by itself.
    for (i in _this.state.childrenCards) {
      pushIfUnique(
        _this.state.childrenCardIds,
        _this.state.childrenCards[i].cardId
      );
    }

    // TODO: Refactor this for cleaner code.
    // Remove any random zero-length strings from childrenCardIds.
    // for (var i = 0; i < _this.state.childrenCardIds.length; i++) {
    //   if (_this.state.childrenCardIds[i] === "") {
    //     _this.state.childrenCardIds.splice(i, 1);
    //   }
    // }
  },

  componentWillUnmount: function() {
    $(GlobalEvents).off('tree:save');
  },

  preventDefault: function(ev) { ev.preventDefault(); },

  // Creates a new card.
  handleAdd: function() {
    var _this = this;
    var uuid = guid();

    _this.state.childrenCards[uuid] = { cardId: uuid };
    _this.setState(_this.state);
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
    delete _this.state.childrenCards[childCard.props.CardId]; 
    _this.setState(_this.state);
  },

  // Handle connecting parent to child.
  dragStart: function(ev) {
    var _this = this;
    var data = { childCardId: _this.state.cardId };
    ev.dataTransfer.setData('text', JSON.stringify(data));
  },

  // Handle collecting information when dropping a card from the messageBank.
  handleDrop: function(ev) {
    ev.preventDefault();
    var _this = this;
    var data;

    try { data = JSON.parse(ev.dataTransfer.getData('text')); }
    catch (e) { return; }

    _this.state.message = data.message;
    _this.setState(_this.state);
  },

  handleMouseEnter: function(ev) {
    ev.preventDefault();
  },

  handleMouseLeave: function(ev) {
    ev.preventDefault();
  },

  // Manually save contentEditable changes to React state since React doesn't
  // automatically handle this for us.
  handleCEChange: function(ev) {
    var _this = this;
    _this.state[ev.target.sourceState] = ev.target.value;
    _this.setState(_this.state);
  },

  // Save the card into the ProcessedTree.
  saveTree: function(ev) {
    var _this = this;

    // TODO: Naive and requires cleanup in the future.
    // Makes sure that the saved result only contains unique children.
    // var uniqueArray = [];
    // uniqueArray = _this.state.childrenCardIds.filter(function(item, pos) {
    //   return _this.state.childrenCardIds.indexOf(item) == pos;
    // });
    // _this.state.childrenCardIds = uniqueArray;

    ProcessedTree[_this.state.cardId] = {
      cardId: _this.state.cardId,
      childrenCardIds: _this.state.childrenCardIds,
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

    // Produce the nested child LogicCards.
    for (childIndex in _this.state.childrenCards) {
      childrenCardViews[childIndex] = (
        <LogicCard
          key={_this.state.childrenCards[childIndex].cardId}
          ref={_this.state.childrenCards[childIndex].cardId}
          cardId={_this.state.childrenCards[childIndex].cardId}
          deleteCard={_this.deleteChildCard}
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
        <div className="logic-card" draggable="true" 
          onDragStart={_this.dragStart}
          onMouseEnter={_this.handleMouseEnter}
          onMouseLeave={_this.handleMouseLeave}>
          <div className="logic-card-content" 
            onDragOver={_this.preventDefault}
            onDrop={_this.handleDrop}>
            <span>ID: </span>
            <div>{_this.state.cardId}</div>
            <span>Children IDs: </span>
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

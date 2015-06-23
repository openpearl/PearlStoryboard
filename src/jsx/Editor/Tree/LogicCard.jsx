var ContentEditable = require('../../ContentEditable.jsx');

var LogicCard = React.createClass({

  getInitialState: function() {
    var _this = this;
    var uuid = guid();

    return {
      cardID: _this.props.cardID || uuid,
      childrenCardIDs: _this.props.childrenCardIDs || [],
      parentCardIDs: _this.props.parentCardIDs || [],

      speaker: _this.props.speaker || "",
      message: _this.props.message || ""

      visible: true,
      highlight: false,
    };
  },

  preventDefault: function(ev) { ev.preventDefault(); },

  // Creates a new card.
  handleAdd: function() {
    var _this = this;
    var uuid = guid();

    // Creates a new Logic card and save it into the GlobalTree.
    GlbTreeCtrl.setLogicCard({
      cardID: uuid,
      childrenCardIDs: [],
      parentCardIDs: [],
      speaker: "",
      message: "",
      visible: true,
      highlight: false
    });
  },

  toggleVisibility: function() {
    var _this = this;
    GlbTreeCtrl.toggleVisibility(_this.state.cardID);
  },

  // Pass the context back to the parent.
  deleteCard: function() {
    // TODO: Remove from Global Tree.
    // Unmount instance of tree from the tree container.
    GlbTreeCtrl.deleteLogicCard(_this.state.cardID);
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

  // Save the card into the GlobalTree.
  saveTree: function(ev) {
    var _this = this;

    // TODO: Move this somewhere else besides here.
    GlobalTree[_this.state.cardID] = {
      cardID: _this.state.cardID,
      parentCardIDs: _this.state.parentCardIDs,
      childrenCardIDs: _this.state.childrenCardIDs,
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

    // Toggle depending on visibility.
    // TODO: Package or shorten for cleaner code.
    if (_this.state.visible === true) {
      childrenTreeStyle = classNames({
        'hide': false
      });
      hideButtonStyle = classNames({
        'fa': true,
        'fa-bookmark': true,
        'fa-bookmark-o': false
      });
    } else {
      childrenTreeStyle = classNames({
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
        <div className="hide-card-button" onClick={_this.toggleVisibility}>
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
            <div>{_this.state.cardID}</div>
            <span>Children IDs: </span>
            <div>{_this.state.childrenCardIDs}</div>
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
      </div>
    );
  }
});

module.exports = LogicCard;

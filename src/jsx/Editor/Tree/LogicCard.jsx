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
      message: _this.props.message || "",

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
    GlbTreeCtrl.toggleVisibility(_this.state.cardID);
  },

  deleteCard: function() {
    GlbTreeCtrl.deleteLogicCard(this.state.cardID);
  },

  // Handle collecting information when dropping a card from the messageBank.
  handleDrop: function(ev) {
    ev.preventDefault();
    console.log("Something was dropped!");

    var _this = this;
    var data;

    try { data = JSON.parse(ev.dataTransfer.getData('text')); }
    catch (e) { return; }

    console.log(data);
    var card = GlbTreeCtrl.getLogicCard(_this.state.cardID);
    card.message = data.message;
    console.log(card);

    GlbTreeCtrl.setLogicCard(card);
  },

  handleMouseEnter: function(ev) {
    ev.preventDefault();
  },

  handleMouseLeave: function(ev) {
    ev.preventDefault();
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
      <div className="logic-card"
        id={_this.state.cardID} 
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
            sourceState="speaker" />
          <span>Message: </span>
          <ContentEditable html={_this.state.message} 
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
    );
  }
});

module.exports = LogicCard;

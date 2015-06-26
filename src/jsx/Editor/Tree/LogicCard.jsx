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

      xpos: _this.props.xpos || 0,
      ypos: _this.props.ypos || 0,
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log("I just updated!");
  },

  preventDefault: function(ev) { ev.preventDefault(); },

  // Creates a new card.
  handleAdd: function() {
    var _this = this;
    var uuid = guid();

    var logicCard = document.querySelector('#' + _this.state.cardID);

    var xpos = Number(logicCard.style.left.slice(0,-2));
    var ypos = Number(logicCard.style.top.slice(0,-2)) + 400;

    // Creates a new Logic card and save it into the GlobalTree.
    GTC.setLogicCard({
      cardID: uuid,
      childrenCardIDs: [],
      parentCardIDs: [_this.state.cardID],
      speaker: "",
      message: "",
      visible: true,
      highlight: false,
      xpos: xpos,
      ypos: ypos
    });

    // Add new child ID to the parent's reference.
    var childrenCardIDs = GTC.getLogicCard(_this.state.cardID).childrenCardIDs;
    childrenCardIDs = pushIfUnique(childrenCardIDs, uuid);

    // Bind the child to the parent.
    GTC.setLogicCard({
      cardID: _this.state.cardID,
      childrenCardIDs: childrenCardIDs
    }).refresh();
  },

  toggleVisibility: function() {
    GTC.toggleVisibility(_this.state.cardID).refresh();
  },

  deleteCard: function() {
    GTC.deleteLogicCard(this.state.cardID).refresh();
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
    var card = GTC.getLogicCard(_this.state.cardID);
    card.message = data.message;
    console.log(card);

    GTC.setLogicCard(card).refresh();
  },

  handleSelect: function(ev) {
    ev.preventDefault();
    console.log("Selected.");
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

    // Draw at the correct location.
    var positionCSS = {
      left: _this.state.xpos,
      top: _this.state.ypos
    }

    console.log(positionCSS);

    return (
      <div className="logic-card" 
        id={_this.state.cardID}
        style={positionCSS}
        onClick={_this.handleSelect}>
        <div className="logic-card-content" 
          onDragOver={_this.preventDefault}
          onDrop={_this.handleDrop}>
          <div className="lc-source"></div>
          <div className="lc-sink"></div>

          <span>Speaker: </span>
          <span>Message: </span>
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

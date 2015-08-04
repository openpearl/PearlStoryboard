var LCMessages = require('./LCMessages.jsx');

var LogicCard = React.createClass({

  getInitialState: function() {
    var _this = this;
    var uuid = guid();

    var initialState = {};
    for (key in CardSchema) {
      initialState[key] = _this.props[key] || CardSchema[key];
    }

    if (initialState.cardID === "default") {
      initialState.cardID = uuid;
    }

    return initialState;
  },

  componentDidMount: function() { 
    var _this = this;

    $(GlobalEvents).on(_this.props.cardID + ":changed", function() {
      _this.state = GTC.getLogicCard(_this.props.cardID);
      _this.setState(_this.state);
    });
  },

  componentDidUpdate: function(prevProps, prevState) {
    console.log("I just updated!");
  },

  componentWillUnmount: function() {
    var _this = this;
    $(GlobalEvents).off(_this.props.cardID + ":changed");
  },

  preventDefault: function(ev) { ev.preventDefault(); },

  // Creates a new card.
  handleAdd: function() {
    console.log("handleAdd called.");
    var _this = this;
    var uuid = guid();

    var logicCard = document.querySelector('#' + _this.state.cardID);

    var xpos = Number(logicCard.style.left.slice(0,-2));
    var ypos = Number(logicCard.style.top.slice(0,-2)) + 400;

    // Creates a new Logic card and save it into the GlobalTree.    
    GTC.setLogicCard({
      cardID: uuid,
      parentCardIDs: [_this.state.cardID],
      ui: {
        xpos: xpos,
        ypos: ypos
      }
    });

    // Add new child ID to the parent's reference.
    var newChildrenCardIDs 
      = GTC.getLogicCard(_this.state.cardID).childrenCardIDs;
    newChildrenCardIDs = pushIfUnique(newChildrenCardIDs, uuid);
    console.log(newChildrenCardIDs);

    // Bind the child to the parent.
    GTC.setLogicCard({
      cardID: _this.state.cardID,
      childrenCardIDs: newChildrenCardIDs
    }).refresh();
  },

  toggleVisibility: function() {
    GTC.toggleVisibility(_this.state.cardID).refresh();
  },

  deleteCard: function() {
    GTC.deleteLogicCard(this.state.cardID).refresh();
  },

  // Handle collecting information when dropping a card from the messagesBank.
  handleDrop: function(ev) {
    ev.preventDefault();
    console.log("Something was dropped!");

    var _this = this;
    var data;

    try { data = JSON.parse(ev.dataTransfer.getData('text')); }
    catch (e) { return; }

    console.log(data);
    var card = GTC.getLogicCard(_this.state.cardID);
    card.messages = pushIfUnique(card.messages, data.message);
    console.log(card);

    GTC.setLogicCard(card).refresh();
  },

  handleSelect: function(ev) {
    var _this = this;
    ev.preventDefault();

    console.log("Selected.");
    $(GlobalEvents).trigger("card:selected", [_this.state.cardID]);
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
    if (_this.state.ui.visible === true) {
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

    // Draw at the correct location.
    var positionCSS = {
      left: _this.state.ui.xpos,
      top: _this.state.ui.ypos
    }

    return (
      <div className="logic-card" 
        id={_this.state.cardID}
        style={positionCSS}
        onClick={_this.handleSelect}
        onDragOver={_this.preventDefault}
        onDrop={_this.handleDrop}>

        <div className="lc-speaker">{_this.state.speaker}</div>
        <LCMessages messages={_this.state.cardBody.messages}/>

        <div className="card-buttons-container">
          
          <div className="add-card-button" onClick={_this.handleAdd}>
            <i className="fa fa-plus"></i>
          </div>

          <div className="hide-card-button" onClick={_this.toggleVisibility}>
            <i className="fa fa-eye"></i>
          </div>

          <div className="delete-card-button" 
            onClick={_this.deleteCard}>
            <i className="fa fa-times"></i>
          </div>

        </div>
        <div className="logic-card-wrapper"></div>
      </div>
    );
  }
});

module.exports = LogicCard;

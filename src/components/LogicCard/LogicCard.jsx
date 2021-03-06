var guid = require('../../utils.js').guid;
var updateObj = require('../../utils.js').updateObj;
var myJsPlumb = require('../../myJsPlumb.js');
var LCInfoField = require('../LCInfoField/LCInfoField.jsx');

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
    newChildrenCardIDs = updateObj(newChildrenCardIDs, uuid);
    console.log(newChildrenCardIDs);

    // Bind the child to the parent.
    GTC.setLogicCard({
      cardID: _this.state.cardID,
      childrenCardIDs: newChildrenCardIDs
    }).refresh();
  },

  toggleVisibility: function() {
    var _this = this;
    GTC.modifySubTree(_this.state.cardID, false, function(card) {
      var _card = card;
      _card.ui.visible = !_card.ui.visible;
      return _card;
    }).refresh();
  },

  deleteCard: function() {
    GTC.deleteLogicCard(this.state.cardID).refresh();
  },

  // Handle collecting information when dropping a card from the messagesBank.
  // handleDrop: function(ev) {
  //   ev.preventDefault();
  //   console.log("Something was dropped!");

  //   var _this = this;
  //   var data;

  //   try { data = JSON.parse(ev.dataTransfer.getData('text')); }
  //   catch (e) { return; }

  //   console.log(data);
  //   var card = GTC.getLogicCard(_this.state.cardID);
  //   card.messages = updateObj(card.messages, data.message);
  //   console.log(card);

  //   GTC.setLogicCard(card).refresh();
  // },

  handleSelect: function(ev) {
    var _this = this;
    ev.stopPropagation();
    ev.preventDefault();
    ev.cancelBubble = true;

    console.log("Selected.");
    $(GlobalEvents).trigger("card:selected", [_this.state.cardID]);
  },

  handleMouseEnter: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    ev.cancelBubble = true;

    var _this = this;
    var subTreeDraggables = GTC.getSubTree(_this.state.cardID);
    myJsPlumb.addToDragSelection(subTreeDraggables);
  },

  handleMouseLeave: function(ev) {
    ev.stopPropagation();
    ev.preventDefault();
    ev.cancelBubble = true;
    myJsPlumb.clearDragSelection();
  },

  render: function() {
    var _this = this;

    var newOrAddButton;
    var hideButton;
    var deleteButton;

    var childrenTreeStyle;
    var hideButtonStyle;

    // Draw at the correct location.
    var positionCSS = {
      left: _this.state.ui.xpos,
      top: _this.state.ui.ypos
    }

    if (!_this.state.ui.visible) {
      positionCSS.visibility = 'hidden';
    } else {
      positionCSS.visibility = 'visible';
    }

    // FIXME: Fix this horrendously hacky code.
    var visibilityCSS = {};
    var childVisible = true;

    try {
      childVisible = GTC.getLogicCard(
        GTC.getLogicCard(_this.state.cardID).childrenCardIDs[0]
      ).ui.visible;
    } catch (err) {}
    
    if (!childVisible) {
      visibilityCSS.color = "#FF4081";
    }

    return (
      <div className="logic-card" 
        id={_this.state.cardID}
        style={positionCSS}
        onMouseEnter={_this.handleMouseEnter}
        onMouseLeave={_this.handleMouseLeave}
        onClick={_this.handleSelect}>

        <LCInfoField title="Speaker: "
          infoField={_this.state.speaker}/>
        <LCInfoField title="Card Type: "
          infoField={_this.state.cardType}/>
        <LCInfoField title="Inputs: "
          infoField={_this.state.inputs}/>
        <LCInfoField title="Filters: "
          infoField={_this.state.filters}/>
        <LCInfoField title="Methods: " 
          infoField={_this.state.methods}/>
        <LCInfoField title="Messages: " 
          infoField={_this.state.cardBody.messages}/>

        <div className="card-buttons-container">
          
          <div className="card-button" onClick={_this.handleAdd}>
            <i className="fa fa-plus"></i>
          </div>

          <div className="card-button" onClick={_this.toggleVisibility}>
            <i className="fa fa-eye" style={visibilityCSS}></i>
          </div>

          <div className="card-button" 
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

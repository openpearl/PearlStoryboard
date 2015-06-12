var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  getInitialState: function() {
    return {
      logicCards: []
    };
  },

  handleAddClick: function(logicCardComponent) {
    console.log("Button was clicked.");
    console.log(logicCardComponent);

    this.addLogicCard();

  },

  addLogicCard: function() {
    var _this = this;

    console.log("Adding logic cards.");

    _this.state.logicCards.push(
      <LogicCard onAddClick={_this.handleAddClick} />
    );

    this.setState(_this.state);
  },

  render: function() {
    var _this = this;

    return (
      <div id="tree-display">
        <LogicCard onAddClick={_this.handleAddClick} />
        {_this.state.logicCards}
      </div>
    );
  }

});

module.exports = Tree;

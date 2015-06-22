var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({
  getInitialState: function() {
    var uuid = guid();
    return {
      uuid: uuid
    };
  },

  resetTree: function(childContext) {
    console.log("Resetting the tree.");
    var _this = this;
    ProcessedTree = {};
    _this.replaceState(_this.getInitialState());
  },

  render: function() {
    var _this = this;
    return (
      <div id="tree-display">
        <LogicCard
          key={_this.state.uuid} 
          ref={_this.state.uuid}
          cardId="root"
          deleteCard={_this.resetTree}
          onChildCreate={function() {return;}} />
      </div>
    );
  }
});

module.exports = Tree;

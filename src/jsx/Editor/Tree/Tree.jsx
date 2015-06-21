var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({
  getInitialState: function() {
    var uniqueDateKey = Date.now();
    return {
      uniqueDateKey: uniqueDateKey
    };
  },

  resetTree: function(childContext) {
    console.log("Resetting the tree.");
    var _this = this;
    _this.replaceState(_this.getInitialState());
  },

  render: function() {
    var _this = this;
    return (
      <div id="tree-display">
        <LogicCard
          key={_this.state.uniqueDateKey} 
          parentCardId="null"
          cardId="root"
          deleteCard={_this.resetTree}
          onChildCreate={function() {return;}}
          ref={_this.state.uniqueDateKey}/>
      </div>
    );
  }
});

module.exports = Tree;

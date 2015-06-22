var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({
  getInitialState: function() {
    var uniqueDateKey = Date.now();
    return {
      uniqueDateKey: uniqueDateKey
    };
  },

  componentDidMount: function() {
    var _this = this;
    $(GlobalEvents).on('tree:reset', function(ev) {
      _this.resetTree();
    });
  },
  
  componentWillUnmount: function () {
    var _this = this;
    $(GlobalEvents).off('tree:reset');
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

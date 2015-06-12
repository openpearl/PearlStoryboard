var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var _this = this;

    return (
      <div id="tree-display">
        <LogicCard card={{}} onAddClick={_this.handleAddClick} />
      </div>
    );
  }

});

module.exports = Tree;

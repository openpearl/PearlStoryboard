var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  getInitialState: function() {
    return {
    };
  },

  componentDidMount: function() {
    $("#tree-display").attachDragger();
  },

  render: function() {
    var _this = this;

    return (
      <div id="tree-display">
        <LogicCard card={{}} deleteCard={function() {return;}}/>
      </div>
    );
  }

});

module.exports = Tree;

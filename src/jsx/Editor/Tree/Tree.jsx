var LogicCard = require('./LogicCard.jsx');

var Tree = React.createClass({

  getInitialState: function() {
    return {
    };
  },

  render: function() {
    var _this = this;
    var uniqueDateKey = Date.now();

    return (
      <div id="tree-display">
        <LogicCard 
          card={{}} 
          deleteCard={function() {return;}}
          ref={uniqueDateKey}/>
      </div>
    );
  }

});

module.exports = Tree;

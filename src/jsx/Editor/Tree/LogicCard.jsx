var LogicCard = React.createClass({

  handleAddClick: function() {
    this.props.onAddClick(this);
  },

  handleDrop: function(e) {
    e.preventDefault();
    var data = e.data;
  },

  componentDidMount: function() {

    // Draws a line.
    // $('#testing').line(0, 0, 20, 20);    
  
  },

  render: function() {
    return (
      <div className="logic-card-block" id="testing" onDrop={this.handleDrop}>
        <div className="logic-card">

          <span>ID: </span>
          <div contentEditable='true'></div>

          <span>Speaker: </span>
          <div contentEditable='true'></div>

          <span>Message: </span>
          <div contentEditable='true'></div>

        </div>

        <div className="add-card-right" onClick={this.handleAddClick}>
          <i className="fa fa-arrow-right"></i>
        </div>

        <div className="add-card-down" onClick={this.handleAddClick}>
          <i className="fa fa-arrow-down"></i>
        </div>

      </div>
    );
  }

});

module.exports = LogicCard;

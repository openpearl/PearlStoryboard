var MessageCard = React.createClass({

  // Handle collecting data for a drag.
  dragStart: function(ev) {
    var _this = this;
    var data = { message: _this.props.message };
    ev.dataTransfer.setData('text', JSON.stringify(data));
  },

  render: function() {
    var _this = this;
    return (
      <div className="message-card" draggable="true" 
        onDragStart={_this.dragStart}>
        <div>{_this.props.message}</div>
      </div>
    );
  }
});

module.exports = MessageCard;

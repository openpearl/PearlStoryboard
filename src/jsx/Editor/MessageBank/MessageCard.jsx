var MessageCard = React.createClass({

  componentDidMount: function() {
    // console.log(this.props.cardId);    
  },

  dragStart: function(ev) {
    var _this = this;

    var data = {
      bankCardId: _this.props.cardId,
      message: _this.props.message
    }

    ev.dataTransfer.setData('text', JSON.stringify(data));
  },

  render: function() {
    var _this = this;
    return (
      <div className="message-card" draggable="true" 
        onDragStart={_this.dragStart}>
        <i>{_this.props.cardId}</i> 
        <div>{_this.props.message}</div>
      </div>
    );
  }
});

module.exports = MessageCard;

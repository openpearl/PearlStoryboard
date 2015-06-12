var MessageCard = React.createClass({

  componentDidMount: function() {
    // console.log(this.props.cardId);    
  },

  render: function() {
    var _this = this;
    return (
      <div className="message-card" draggable="true">
        <i>{_this.props.cardId}</i> 
        <div>{_this.props.message}</div>
      </div>
    );
  }
});

module.exports = MessageCard;

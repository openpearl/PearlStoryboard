var LCMessages = React.createClass({
  
  render: function() {
    var _this = this;
    
    // Make sure that all props provided are arrays.
    if (!(_this.props.messages instanceof Array)) {
      _this.props.messages = [_this.props.messages];            
    }

    var messagesHolderUI = [];
    for (var i in _this.props.messages) {
      messagesHolderUI.push(<li>{_this.props.messages[i]}</li>);
    }

    // console.log(messagesHolderUI);

    return (
      <div className="lc-messages">
        <span>Messages:</span>
        <ul>
          {messagesHolderUI}
        </ul>
      </div>
    );
  }

});

module.exports = LCMessages;

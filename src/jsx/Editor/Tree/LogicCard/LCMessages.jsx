var LCMessages = React.createClass({
  
  render: function() {
    var _this = this;
    
    // Make sure that all props provided are arrays.
    if (!(_this.props.messages instanceof Array)) {
      _this.props.messages = [_this.props.messages];            
    }

    // Determine how the view should be displayed.
    var showIfVisible = null;
    var spanInfo = null;
    var messagesHolderUI = [];

    // If empty, hide.
    if (_this.props.messages.length === 0 || _this.props.messages[0] === "") {
      showIfVisible = { display: "none" };
    
    // If there's only one, display inline.
    } else if (_this.props.messages.length === 1) {
      spanInfo = _this.props.messages;
    
    // If multiline, display as bullet points.
    } else {
      for (var i in _this.props.messages) {
        messagesHolderUI.push(<li>{_this.props.messages[i]}</li>);
      }      
    }

    // console.log(messagesHolderUI);

    return (
      <div className="card-info-field" style={showIfVisible}>
        <span className="card-info-title">{_this.props.title}</span>
        {spanInfo}
        <ul>
          {messagesHolderUI}
        </ul>
      </div>
    );
  }

});

module.exports = LCMessages;

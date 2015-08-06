var LCInfoField = React.createClass({
  
  render: function() {
    var _this = this;
    
    // Make sure that all props provided are arrays.
    if (!(_this.props.infoField instanceof Array)) {
      _this.props.infoField = [_this.props.infoField];            
    }

    // Determine how the view should be displayed.
    var showIfVisible = null;
    var spanInfo = null;
    var infoFieldHolderUI = [];

    // If empty, hide.
    if (_this.props.infoField.length === 0 || 
      _this.props.infoField[0] === "") {
      
      showIfVisible = { display: "none" };
    
    // If there's only one, display inline.
    } else if (_this.props.infoField.length === 1) {
      spanInfo = _this.props.infoField;
    
    // If multiline, display as bullet points.
    } else {
      for (var i in _this.props.infoField) {
        infoFieldHolderUI.push(<li>{_this.props.infoField[i]}</li>);
      }      
    }

    return (
      <div className="card-info-field" style={showIfVisible}>
        <span className="card-info-title">{_this.props.title}</span>
        {spanInfo}
        <ul>
          {infoFieldHolderUI}
        </ul>
      </div>
    );
  }

});

module.exports = LCInfoField;

var MessageBank = React.createClass({

  getInitialState: function () {
    return {
      messageBank: []
    };
  },

  componentDidMount: function() {

    var _this = this;

    // Load message bank data.
    $.ajax({
      type: "GET",
      url: "files/messages.csv",
      dataType: "text",
      success: function(data) {
        _this.processData(data);
        _this.bindSearch();
      }
    });

  },

  processData: function(allText) {
    var _this = this;
    var allTextLines = allText.split(/\r\n|\n/);

    _this.state.messageBank = allTextLines;
    this.setState(_this.state.messageBank);
  },

  bindSearch: function() {

    $messages = $(".message-card");

    $('#searchbar').keyup(function() {
      var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
      console.log(val);
      
      $messages.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
      }).hide();
    });
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (i = 0; i < _this.state.messageBank.length; i++) {
      messageCards.push(
        <div className="message-card">
          {_this.state.messageBank[i]}
        </div>
      );
    }

    return (
      <div id="message-bank">
        <input type="text" id="searchbar"></input>
        <div>{messageCards}</div>
      </div>
    );
  }
  
});

module.exports = MessageBank;

var guid = require('../../utils.js').guid;
var MessageCard = require('../MessageCard/MessageCard.jsx');

var MessageBank = React.createClass({

  getInitialState: function () {
    return { messageBank: [] };
  },

  componentDidMount: function() {
    var _this = this;

    $.ajax({
      type: "GET",
      url: "files/messages.csv",
      dataType: "text",
      success: function(data) {
        console.log("messages.csv loaded.");
        _this.state.messageBank = data.split(/\r\n|\n/);
        _this.setState(_this.state);
        _this.bindSearch();
      }
    });  
  },

  bindSearch: function() {
    $messages = $(".message-card");
    $('#searchBarNew').keyup(function() {
      var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
      $messages.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
      }).hide();
    });
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (var i in _this.state.messageBank) {
      var uuid = guid();
      messageCards.push(<MessageCard 
        key={uuid} message={_this.state.messageBank[i]} />);
    }

    if (messageCards.length === 0) {
      messageCards = <div id="placeholder-bank-text">Try adding a messages.csv file for a word bank! (Upload button above.)</div>;
    }

    return (
      <div id="message-bank">
        <input id="searchBarNew" type="text" placeholder="Search: "></input>
        <div>{messageCards}</div>
      </div>
    );
  }
});

module.exports = MessageBank;

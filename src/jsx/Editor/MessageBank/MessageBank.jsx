var MessageCard = require('./MessageCard.jsx');

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
    $('#searchbar').keyup(function() {
      var val = $.trim($(this).val()).replace(/ +/g, ' ').toLowerCase();
      $messages.show().filter(function() {
        var text = $(this).text().replace(/\s+/g, ' ').toLowerCase();
        return !~text.indexOf(val);
      }).hide();
    });
  },

  toggleBank: function(){
    console.log("Toggling bank.");
    $("#message-bank").toggle();
  },

  setDownloadLink: function(messagesJson, downloadName, linkMessage) {
    var data = "text/json;charset=utf-8," 
      + encodeURIComponent(JSON.stringify(messagesJson));

    $('#download-link').empty();
    $('<a href="data:' + data + '" download=' + downloadName + '>'
      + linkMessage + '</a>').appendTo('#download-link');
  },

  triggerSaveTree: function() {
    $(GlobalEvents).trigger('tree:save');
  },

  downloadTree: function() {
    this.setDownloadLink(ProcessedTree, "final.json",
      "Download final conversion.");
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (var i in _this.state.messageBank) {
      messageCards.push(<MessageCard message={_this.state.messageBank[i]} />);
    }

    return (
      <div>
        <div id="button-storage">
      
          <div className="bt-menu" onClick={_this.toggleBank}>
            <i className="fa fa-bars"></i>
          </div>

          <div className="bt-menu">
            <i className="fa fa-floppy-o"></i>
          </div>

          <div className="bt-menu" onClick={_this.downloadTree}>
            <i className="fa fa-download"></i>
          </div>

          <form
            encType="multipart/form-data"
            action="  /files/processedTree"
            method="post" > 
            <input type="file" name="file"></input>
            <input type="submit"><i className="fa fa-upload"></i></input>
          </form>
      
          <div id="download-link"></div>
        </div>

        <div id="message-bank">
          <input type="text" id="searchbar" placeholder="Search: "></input>
          <div>{messageCards}</div>
        </div>
      
      </div>
    );
  }
});

module.exports = MessageBank;

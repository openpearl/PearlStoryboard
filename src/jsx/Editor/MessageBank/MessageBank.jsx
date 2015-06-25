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

    $("#fileUpload").change(function() {
      $("#hiddenForm").submit();
    });

    // Bind the file upload button to upload once file is selected.
    // document.getElementById("file").onchange = function() {
    //   document.getElementById("form").submit();
    // };
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

  toggleBank: function(){
    console.log("Toggling bank.");
    $("#message-bank").toggle(100);
  },

  triggerSaveTree: function() {
    $(GlobalEvents).trigger('tree:save');
  },

  downloadTree: function(ev) {
    ev.preventDefault();
    window.open('files/input.json', '_blank');
  },

  uploadTree: function() {
    $("#fileUpload").click();
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (var i in _this.state.messageBank) {
      var uuid = guid();
      messageCards.push(<MessageCard 
        key={uuid} message={_this.state.messageBank[i]} />);
    }

    return (
      <div id="sidebar">

        <div id="message-bank">
          <input id="searchBarNew" type="text" placeholder="Search: "></input>
          <div>{messageCards}</div>
        </div>

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

          <div className="bt-menu" onClick={_this.uploadTree}>
            <i className="fa fa-upload"></i>
          </div>

          <form
            id="hiddenForm"
            encType="multipart/form-data"
            action="  /files/processedTree"
            method="post" > 
            <input type="file" name="file" id="fileUpload"></input>
          </form>

        </div>

      </div>
    );
  }
});

module.exports = MessageBank;

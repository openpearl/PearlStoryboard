var MessageBank = require('./MessageBank/MessageBank.jsx');
var ContentEditor = require('./ContentEditor.jsx');

var Sidebar = React.createClass({

  componentDidMount: function() {
    var _this = this;

    $("#fileUpload").change(function() {
      $("#hiddenForm").submit();
    });

    $(GlobalEvents).on("sidebar:toggle", function() {
      _this.toggleBank();
    });
  },

  componentWillUnmount: function() {  
    $(GlobalEvents).off("sidebar:toggle");        
  },

  toggleBank: function(){
    console.log("Toggling bank.");
    $("#sidebar-col1").toggle(100);
  },

  saveTree: function() {
    // var data = GTC.getTree();
    GTC.saveTree();

    // $.ajax({
    //   type: "POST",
    //   url: "/save",
    //   data: data,
    //   success: function() {}
    // });

  },

  downloadTree: function(ev) {
    ev.preventDefault();

    // Save tree to the location.
    var uri = "data:text/json;charset=utf-8," 
          + encodeURIComponent(JSON.stringify(GTC.getTree()));

    var downloadLink = document.createElement("a");
    downloadLink.href = uri;
    downloadLink.download = "input.json";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  },

  uploadTree: function() {
    $("#fileUpload").click();
  },

  render: function() {
    var _this = this;

    return (
      <div id="sidebar">

        <div id="sidebar-col1">
          <ContentEditor />
          <MessageBank />
        </div>

        <div id="button-storage">
          <div className="bt-menu" onClick={_this.toggleBank}>
            <i className="fa fa-bars"></i>
          </div>

          <div className="bt-menu" onClick={_this.saveTree}>
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

module.exports = Sidebar;
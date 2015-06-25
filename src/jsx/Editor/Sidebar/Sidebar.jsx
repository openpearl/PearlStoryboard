var MessageBank = require('./MessageBank/MessageBank.jsx');
var ContentEditor = require('./ContentEditor.jsx');

var Sidebar = React.createClass({

  componentDidMount: function() {
    $("#fileUpload").change(function() {
      $("#hiddenForm").submit();
    });
  },

  toggleBank: function(){
    console.log("Toggling bank.");
    $("#sidebar-col1").toggle(100);
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

module.exports = Sidebar;
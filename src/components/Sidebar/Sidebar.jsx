var myJsPlumb = require('../../myJsPlumb.js');
var MessageBank = require('../MessageBank/MessageBank.jsx');
var ContentEditor = require('../ContentEditor/ContentEditor.jsx');

var Sidebar = React.createClass({

  getInitialState: function () {
    return {
      canDrag: myJsPlumb.getDragStatus()       
    };
  },

  componentDidMount: function() {
    var _this = this;

    $("#fileUpload").change(function() {
      $("#hiddenForm").submit();
    });

    $(GlobalEvents).on("sidebar:toggle", function() {
      _this.toggleBank();
    });

    $(GlobalEvents).on("dragging:toggle", function() {
      _this.state.canDrag = myJsPlumb.getDragStatus();
      _this.setState(_this.state);
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
    GTC.saveTree();
  },

  downloadTree: function(ev) {
    ev.preventDefault();

    // First save.
    GTC.saveTree(function() {
      
      // Then, Get both files.
      $.get('/files/input.json', function(data) {
        var input = data;
        $.get('/files/input.json', function(data) {
          var inputMin = data;

          var inputURI = "data:text/json;charset=utf-8," + 
            encodeURIComponent(JSON.stringify(input));

          var inputMinURI = "data:text/json;charset=utf-8," + 
            encodeURIComponent(JSON.stringify(inputMin));

          var downloadLink = document.createElement("a");
          
          // Finally, download twice.
          downloadLink.href = inputURI;
          downloadLink.download = "input.json";
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          setTimeout(function() {
            downloadLink.href = inputMinURI;
            downloadLink.download = "input.min.json";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
          }, 100);
        });
      });
    });
  },

  uploadTree: function() {
    $("#fileUpload").click();
  },

  toggleGroupDrag: function() {
    myJsPlumb.toggleGroupDrag();
  },

  render: function() {
    var _this = this;
    var draggingStyle = {};

    if (_this.state.canDrag) {
      draggingStyle = {
        color: "#FF4081"
      }
    }

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

          <div className="bt-menu" onClick={_this.toggleGroupDrag}>
            <i className="fa fa-hand-rock-o" style={draggingStyle}></i>
          </div>

          <form
            id="hiddenForm"
            encType="multipart/form-data"
            action="/files/processedTree"
            method="post" > 
            <input type="file" name="file" id="fileUpload"></input>
          </form>

        </div>
      </div>
    );
  }

});

module.exports = Sidebar;
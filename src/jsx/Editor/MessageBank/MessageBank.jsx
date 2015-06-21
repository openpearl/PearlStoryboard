var MessageCard = require('./MessageCard.jsx');

var MessageBank = React.createClass({

  getInitialState: function () {
    return {
      messageBank: {}
    };
  },

  componentDidMount: function() {
    var _this = this;

    // Load the message.json file, which is a processed version of message.csv
    $.ajax({
      type: "GET",
      url: "files/messages.json",
      dataType: "json",
      success: function(data) {
        console.log("messages.json loaded.");

        _this.setState({
          messageBank: data
        })
        _this.bindSearch(); // Allow for the list to be searchable.
      },

      // If no message.json file found, reprocess message.csv
      // TODO: Package this so that we don't get a hugely nested callback.
      error: function() {
        $.ajax({
          type: "GET",
          url: "files/messages.csv",
          dataType: "text",
          success: function(data) {
            console.log("messages.csv loaded.");
            _this.getRandomIDs(data);
          }
        });
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

  getRandomIDs: function(allText) {
    console.log("Getting random IDs.");

    var _this = this;
    var allTextLines = allText.split(/\r\n|\n/);
    var allTextLinesLength = allTextLines.length;

    if (allTextLines.length === 0) { return; }

    // Use Random.org to generate IDs for us so that we don't have 
    // redundancies.
    // TODO: Consider alternatives that are local so we don't have to jump
    // everywhere for our services.
    var randomOrgRequest = {
      "jsonrpc": "2.0",
      "method": "generateStrings",
      "params": {
        "apiKey": "5b278ac6-92aa-429e-8fda-37bd41245594",
        "n": allTextLinesLength,
        "length": 7,
        "characters": "abcdefghijklmnopqrstuvwxyz",
        "replacement": false
      },
      "id": 18197
    }

    var randomOrgUrl = "https://api.random.org/json-rpc/1/invoke";
    $.post(randomOrgUrl, JSON.stringify(randomOrgRequest), function (data) {

      console.log("Bits used: " + data.result.bitsUsed);
      console.log("Bits left: " + data.result.bitsLeft);
      console.log("Requests left: " +data.result.requestsLeft);

      var randomIDs = data.result.random.data;
      var messagesJson = {};

      for (var i = 0; i < randomIDs.length; i++) {
        messagesJson[ randomIDs[i] ] = allTextLines[i];
      }

      console.log(messagesJson)
      _this.setDownloadLink(messagesJson, "messages.json", 
        "Download 1st conversion.");
    });
  },

  setDownloadLink: function(messagesJson, downloadName, linkMessage) {
    var data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(messagesJson));

    $('#download-link').empty();
    $('<a href="data:' + data + '" download=' + downloadName + '>'
      + linkMessage
      + '</a>').appendTo('#download-link');
  },

  triggerSaveTree: function() {
    $(GlobalEvents).trigger('tree:save');
  },

  downloadTree: function() {
    this.setDownloadLink(ProcessedTree, "final.json",
      "Download final conversion.");
  },

  loadTree: function() {

    // TODO: Upload the document.
    // Choose the root as the entry point.
    // Render the root and each child accordingly.
    // Recursively call the render.
    // Pop the already rendered nodes out of the equation 
    // for faster processing.

        
    
  },

  render: function() {
    var _this = this;

    var messageCards = [];
    for (var id in _this.state.messageBank) {
      messageCards.push(
        <MessageCard key={id} cardId={id} 
          message={_this.state.messageBank[id]} />
      );
    }

    return (
      <div id="message-bank">
        <button onClick={_this.triggerSaveTree}>Trigger Save</button>
        <button onClick={_this.downloadTree}>Download</button>
        <button onClick={_this.loadTree}>Load</button>
        <div id="download-link"></div>
        <input type="text" id="searchbar" placeholder="Search: "></input>
        <div>{messageCards}</div>
      </div>
    );
  }
  
});

module.exports = MessageBank;

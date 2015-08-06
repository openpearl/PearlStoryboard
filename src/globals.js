CardSchema = {
  cardID: "root", // String
  childrenCardIDs: [], // [String]
  parentCardIDs: [], // [String] 

  speaker: "", // String
  filters: [], // [String]
  inputs: [], // [String]
  methods: [], // [String]

  cardType: "", // String
  cardBody: {
    messages: [], // [String]  
  },

  ui: { // Only for visualization. Will get removed on final save.
    visible: true, // Boolean
    highlight: false, // Boolean

    xpos: 300, // Number
    ypos: 300, // Number  
  }
};

GlobalEvents = {}; // Global event system.
GTC = require('./tree.js');

module.exports = {};

# PearlTool-LogicGenerator
[![GitHub version](https://badge.fury.io/gh/openpearl%2FPearlTool-LogicGenerator.svg)](http://badge.fury.io/gh/openpearl%2FPearlTool-LogicGenerator)

### About

The Logic Generator is a handy utility to design a conversation plugin for Pearl. With this tool, you can design the flow and logic of your conversation for your users without having to craft the `JSON` of the conversation yourself.

### Usage

1. Visit https://www.openpearl.org/logic-generator to get access to the tool.
1. Pan and zoom around the screen to view the whole tree. Navigate using `WASD`.
1. Toggle to sidebar with the `Q` key.
1. Save and load your existing trees to maintain your progress.
1. Logic Generator will produce for you a `storyboard.json` file, which you can complement with a `logic.rb` document that contains the actual logic `storyboard.json` references.

### Card Design

The most important concept and purpose for this tool is card design. Cards act as the conversation vehicle for Pearl's services, and the language for these cards should be consistent across all formats. Here is the current design:

```
// This is the key as well as the cardID.
"id_31f6e7046976d442": {
  cardID: "id_31f6e7046976d442",

  parentCardIDs: [],
  childrenCardIDs: [],

  // `speaker` can be `client`, `ai`, or in the future - usernames / names.
  // With the speaker as the client, this card is meant to be editable.
  speaker: "client",

  // Tells our programs to render and treat the following as an email.
  // This is how we can render and edit cards properly on the client.
  cardType: "email",

  // The bulk of our card. This will contain the data that will be properly
  // treated based on the `cardType`.
  cardBody: {

    // `messages` is blank here because it will be filled in by the client.
    message: "",
  }

  // Relays what can be modified. This is specific to `client` related cards.
  inputs: ["message"],
}

``` 

### For Developers

* The Logic Generator is written using ReactJS, jsPlumb, and the JQuery Panzoom plugin.
* This tool uses the Gulp task runner. To start, run `gulp`.
* Install any missing dependencies using `npm install` and `bower install`.
* Please submit issues and pull requests to keep this tool up-to-date!
* Any direct questions can be made at _____, and other questions can be filed at StackOverflow.
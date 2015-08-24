# PearlStoryboard
[![GitHub version](https://badge.fury.io/gh/openpearl%2FPearlStoryboard.svg)](http://badge.fury.io/gh/openpearl%2FPearlStoryboard)

### About

The Logic Generator is a handy utility to design a conversation plugin for Pearl. With this tool, you can design the flow and logic of your conversation for your users without having to craft the `JSON` of the conversation yourself.

### Usage

#### Run remotely (easy)
(Currently, PearlStoryboard is not hosted on any server and is not available remotely. This ability will come out in the future.)

1. ~~Visit https://www.openpearl.org/storyboard to get access to the tool.~~

#### Run locally (harder)

1. Clone or download this repository.
1. Make sure you have NodeJS. If not, follow some tutorials online or visit their official homepage at https://nodejs.org/.
1. Now `npm install` to get all dependencies.
1. We need Bower for installing any libraries our front-end app needs. Get Bower at http://bower.io/.
1. Run `bower install` to get all of our front-end dependencies.
1. We also need Gulp to run our development tasks. Learn to get Gulp at http://gulpjs.com/.
1. Run `gulp` to start the server and compile our build folders.

#### Things to do
* Pan and zoom around the screen to view the whole tree. Navigate using `WASD` or by dragging with the mouse.
* Toggle to sidebar with the `Q` key.
* Toggle subtree dragging with the `E` key. Handy for moving large subtrees. The current downside of leave subtree dragging on is that this makes registering clicking on cards significantly slower. A fix will come for this as the tool becomes optimized.
* Save and load your existing trees to maintain your progress. (Currently, no hotkeys exist for this, but it will come soon.)
* Pearl Storyboard will produce for you a `storyboard.json` file, which you can complement with a `logic.rb` document that contains the actual logic `storyboard.json` references.

### Card Design

The most important concept and purpose for this tool is card design. Cards act as the conversation vehicle for Pearl's services, and the language for these cards should be consistent across all formats. Here is the current design:

```
// This is the key as well as the cardID.
"id_31f6e7046976d442": {
  cardID: "id_31f6e7046976d442",

  // These are antiquated terms that are relics of the tree design.
  // Since we are now using a directed graph, these should be called
  // lastCardIDs and nextCardIDs in the future.
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
* Please submit issues and pull requests to keep this tool up-to-date!

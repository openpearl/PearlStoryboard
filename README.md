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

### For Developers

* The Logic Generator is written using ReactJS, jsPlumb, and the JQuery Panzoom plugin.
* This tool uses the Gulp task runner. To start, run `gulp`.
* Install any missing dependencies using `npm install` and `bower install`.
* Please submit issues and pull requests to keep this tool up-to-date!
* Any direct questions can be made at _____, and other questions can be filed at StackOverflow.
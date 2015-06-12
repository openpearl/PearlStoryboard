/**
 * Using React 0.13.2
 * Updated 2015-04-28
 */

var TreeNode = React.createClass({
  getInitialState: function() {
    return {
      visible: true
    };
  },
  render: function() {
    var childNodes;
    var classObj;

    if (this.props.node.childNodes != null) {
      childNodes = this.props.node.childNodes.map(function(node, index) {
        return <li key={index}><TreeNode node={node} /></li>
      });

      classObj = {
        togglable: true,
        "togglable-down": this.state.visible,
        "togglable-up": !this.state.visible
      };
    }

    var style;
    if (!this.state.visible) {
      style = {display: "none"};
    }

    return (
      <div>
        <h5 onClick={this.toggle} className={React.addons.classSet(classObj)}>
          {this.props.node.title}
        </h5>
        <ul style={style}>
          {childNodes}
        </ul>
      </div>
    );
  },
  toggle: function() {
    this.setState({visible: !this.state.visible});
  }
});

var tree = {
  title: "howdy",
  childNodes: [
    {title: "bobby"},
    {title: "suzie", childNodes: [
      {title: "puppy", childNodes: [
        {title: "dog house"}
      ]},
      {title: "cherry tree"}
    ]}
  ]
};

React.render(
  <TreeNode node={tree} />,
  document.getElementById("tree")
);
  
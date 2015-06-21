var ContentEditable = React.createClass({
	render: function(){
		return <div 
			onInput={this.emitChange} 
			onBlur={this.emitChange}
			contentEditable
			dangerouslySetInnerHTML={{__html: this.props.html}}></div>;
	},
	shouldComponentUpdate: function(nextProps){
		return nextProps.html !== this.getDOMNode().innerHTML;
	},
	emitChange: function(){
		var html = this.getDOMNode().innerHTML;
		if (this.props.onChange && html !== this.lastHtml) {

			this.props.onChange({
				target: {
					value: html,
					// Determines which source the content is from.
					sourceState: this.props.sourceState
				}
			});
		}
		this.lastHtml = html;
	}
});

module.exports = ContentEditable;

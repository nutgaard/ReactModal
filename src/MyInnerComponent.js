module.exports = React.createClass({
    render: function() {
        return <button onClick={this.props.close}>Click to close</button>;
    }
});
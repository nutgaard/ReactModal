var Portal = require('./Portal.js');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            portalElementPrefix: 'ReactModal',
            isOpen: false
        };
    },
    componentDidMount: function () {
        if (typeof this.portalElement === 'undefined') {
            this.portalElement = document.createElement('div');
            this.portalElement.className = "ReactModalContainer";
            document.body.appendChild(this.portalElement);
        }
        this.renderPortal(this.props, this.state);
    },
    componentWillReceiveProps: function(props) {
        this.renderPortal(props, this.state);
    },
    componentWillUnmount: function () {
        document.body.removeChild(this.portalElement);
    },
    componentDidUpdate: function() {
        this.renderPortal(this.props, this.state)
    },
    close: function() {
        this.setState({isOpen: false});
    },
    open: function() {
        this.setState({isOpen: true});
    },
    renderPortal: function (props, state) {
        this.modal = React.render(<Portal {...props} {...state} close={this.close} open={this.open}/>, this.portalElement);
    },
    render: function () {
        return null;
    }
});
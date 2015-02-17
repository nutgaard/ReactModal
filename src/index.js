var Portal = require('./Portal.js');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            portalElementPrefix: 'ReactModal'
        };
    },
    componentDidMount: function () {
        if (typeof this.portalElement === 'undefined') {
            this.portalElement = document.createElement('div');
            this.portalElement.className = "ReactModalContainer";
            document.body.appendChild(this.portalElement);
        }
        this.renderPortal(this.props);
    },
    componentWillReceiveProps: function(props) {
        this.renderPortal(props);
    },
    componentWillUnmount: function () {
        document.body.removeChild(this.portalElement);
    },
    renderPortal: function (props) {
        this.modal = React.render(<Portal {...props} />, this.portalElement);
    },
    render: function () {
        return null;
    }
});
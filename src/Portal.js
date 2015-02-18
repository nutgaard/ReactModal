var FocusHelper = require('./focusHelper.js');

module.exports = React.createClass({
    getInitialState: function () {
        return {
            focusAfterClose: null,
            isOpen: true
        };
    },
    componentWillMount: function () {
        if (this.props.isOpen) {
            this.open();
        }
    },
    componentWillReceiveProps: function (newProps) {
        if (newProps.hasOwnProperty('isOpen') && newProps.isOpen === true) {
            this.open();
        } else {
            this.close();
        }
    },
    open: function () {
        this.setState({isOpen: true});
    },
    close: function () {
        this.setState({isOpen: false});
    },
    keyHandler: function (event) {
        switch (event.keyCode) {
            case 27: //ESC
                this.close();
                event.stopPropagation();
                event.preventDefault();
                break;
            case 9: //Tab
                if (this.handleTabbing(event.shiftKey)) {
                    event.stopPropagation();
                    event.preventDefault();
                }
                break;
        }
    },
    handleTabbing: function (shiftKey) {
        var tabbables = FocusHelper.findTabbables(this.refs.content.getDOMNode());
        if (tabbables.length === 0) {
            return;
        }

        var lastValidTabbable = shiftKey ? tabbables[0] : tabbables[tabbables.length - 1];
        var currentFocus = document.activeElement;

        if (currentFocus === lastValidTabbable) {
            var newFocusElement = shiftKey ? tabbables[tabbables.length - 1] : tabbables[0];
            newFocusElement.focus();
            return true;
        }
        return false;
    },
    render: function () {
        if (!this.state.isOpen) {
            return null;
        }
        return (
            <div tabIndex="-1" onKeyDown={this.keyHandler}>
                <div className="backdrop" onClick={this.close}></div>
                <div className="centering">
                    <div className="content" ref="content">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }
});
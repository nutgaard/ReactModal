var FocusHelper = require('./focusHelper.js');
var ClassHelper = require('./ClassHelper.js');
var IdGenerator = require('./IdHelper.js');

module.exports = React.createClass({
    focusAfterClose: undefined,
    componentDidMount: function () {
        if (this.props.isOpen === true) {
            this.focusFirst();
        }
    },
    componentDidUpdate: function () {
        if (this.props.isOpen) {
            ClassHelper.addClass('modal-open', document.body);
            this.focusFirst();
        } else {
            this.restoreFocus();
            ClassHelper.removeClass('modal-open', document.body);
        }
    },
    keyHandler: function (event) {
        switch (event.keyCode) {
            case 27: //ESC
                this.props.close();
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
    focusFirst: function () {
        this.focusAfterClose = document.activeElement;
        var tabbables = FocusHelper.findTabbables(this.refs.content.getDOMNode());
        if (tabbables.length > 0) {
            tabbables[0].focus();
        }
    },
    restoreFocus: function () {
        if (this.focusAfterClose) {
            this.focusAfterClose.focus();
            this.focusAfterClose = undefined;
        }
    },
    render: function () {
        if (!this.props.isOpen) {
            return null;
        }

        var children = this.props.children;
        if (!children.hasOwnProperty('length')) {
            children = [children];
        }

        children = children.map(function (child) {
            child.props.open = this.props.open;
            child.props.close = this.props.close;
            return child;
        }.bind(this));

        var title = createAriaOptional('title', this.props.title, this.props.showTitle, this.props.titleTag);
        var description = createAriaOptional('description', this.props.description, this.props.showDescription, this.props.descriptionTag);

        return (
            <div tabIndex="-1" onKeyDown={this.keyHandler} role="dialog" aria-labelledby={title.id} aria-describedby={description.id}>
                <div className="backdrop" onClick={this.props.close}></div>
                <div className="centering">
                    {title.hidden}
                    {description.hidden}
                    <div className="content" ref="content">
                        {title.visible}
                        {description.visible}
                        {children}
                    </div>
                </div>
            </div>
        );
    }
});
function createAriaOptional(idPrefix, content, visibility, tag) {
    var id = IdGenerator.generateId('react-modalx-' + idPrefix + '-');

    var tagComponents = tag.split('.');
    var tagType = tagComponents[0];
    var className = '';

    if (tagComponents.length === 2) {
        var className = tagComponents[1];
    }

    var element = React.createElement(tagType, {id: id, className: className}, content);
    return {
        id: id,
        hidden: visibility ? null : element,
        visible: visibility ? element : null
    };
}
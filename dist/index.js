!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Modal=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/index.js":[function(require,module,exports){
var Portal = require('./Portal.js');

module.exports = React.createClass({displayName: "exports",
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
        this.modal = React.render(React.createElement(Portal, React.__spread({},  props,  state, {close: this.close, open: this.open})), this.portalElement);
    },
    render: function () {
        return null;
    }
});

},{"./Portal.js":"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\Portal.js"}],"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\ClassHelper.js":[function(require,module,exports){
function addClass( classname, element ) {
    var cn = element.className;
    //test for existance
    if( cn.indexOf( classname ) != -1 ) {
        return;
    }
    //add a space if the element already has class
    if( cn != '' ) {
        classname = ' '+classname;
    }
    element.className = cn+classname;
}

function removeClass( classname, element ) {
    var cn = element.className;
    var rxp = new RegExp( "\\s?\\b"+classname+"\\b", "g" );
    cn = cn.replace( rxp, '' );
    element.className = cn;
}

module.exports = {
    addClass: addClass,
    removeClass: removeClass
};

},{}],"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\Portal.js":[function(require,module,exports){
var FocusHelper = require('./focusHelper.js');
var ClassHelper = require('./ClassHelper.js');

module.exports = React.createClass({displayName: "exports",
    focusAfterClose: undefined,
    componentDidMount: function() {
        if (this.props.isOpen === true) {
            this.focusFirst();
        }
    },
    componentDidUpdate: function(){
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
    focusFirst: function() {
        this.focusAfterClose = document.activeElement;
        var tabbables = FocusHelper.findTabbables(this.refs.content.getDOMNode());
        if (tabbables.length > 0) {
            tabbables[0].focus();
        }
    },
    restoreFocus: function() {
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
        if(!children.hasOwnProperty('length')) {
            children = [children];
        }

        children = children.map(function(child){
            child.props.open = this.props.open;
            child.props.close = this.props.close;
            return child;
        }.bind(this));
        return (
            React.createElement("div", {tabIndex: "-1", onKeyDown: this.keyHandler}, 
                React.createElement("div", {className: "backdrop", onClick: this.props.close}), 
                React.createElement("div", {className: "centering"}, 
                    React.createElement("div", {className: "content", ref: "content"}, 
                        children
                    )
                )
            )
        );
    }
});

},{"./ClassHelper.js":"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\ClassHelper.js","./focusHelper.js":"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\focusHelper.js"}],"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\focusHelper.js":[function(require,module,exports){
function focusable(element, isTabIndexNotNaN) {
    var nodeName = element.nodeName.toLowerCase();
    return (/input|select|textarea|button|object/.test(nodeName) ?
            !element.disabled :
            "a" === nodeName ?
            element.href || isTabIndexNotNaN :
                isTabIndexNotNaN) && visible(element);
}
function hidden(el) {
    return (el.offsetWidth <= 0 && el.offsetHeight <= 0) ||
        el.style.display === 'none';
}

function visible(element) {
    while (element) {
        if (element === document.body) break;
        if (hidden(element)) return false;
        element = element.parentNode;
    }
    return true;
}
function tabbable(element) {
    var tabIndex = element.getAttribute('tabindex');
    if (tabIndex === null) tabIndex = undefined;
    var isTabIndexNaN = isNaN(tabIndex);
    return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
}
function findTabbables(container) {
    return [].slice.call(container.querySelectorAll('*'), 0).filter(function (element) {
        return tabbable(element)
    });
}


module.exports = {
    findTabbables: findTabbables
};

},{}]},{},["./src/index.js"])("./src/index.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXFVzZXJzXFxOaWNrbGFzXFxJZGVhUHJvamVjdHNcXFJlYWN0TW9kYWxcXHNyY1xcaW5kZXguanMiLCJDOlxcVXNlcnNcXE5pY2tsYXNcXElkZWFQcm9qZWN0c1xcUmVhY3RNb2RhbFxcc3JjXFxDbGFzc0hlbHBlci5qcyIsIkM6XFxVc2Vyc1xcTmlja2xhc1xcSWRlYVByb2plY3RzXFxSZWFjdE1vZGFsXFxzcmNcXFBvcnRhbC5qcyIsIkM6XFxVc2Vyc1xcTmlja2xhc1xcSWRlYVByb2plY3RzXFxSZWFjdE1vZGFsXFxzcmNcXGZvY3VzSGVscGVyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUEsSUFBSSxNQUFNLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDOztBQUVwQyxvQ0FBb0MsdUJBQUE7SUFDaEMsZUFBZSxFQUFFLFlBQVk7UUFDekIsT0FBTztZQUNILG1CQUFtQixFQUFFLFlBQVk7WUFDakMsTUFBTSxFQUFFLEtBQUs7U0FDaEIsQ0FBQztLQUNMO0lBQ0QsaUJBQWlCLEVBQUUsWUFBWTtRQUMzQixJQUFJLE9BQU8sSUFBSSxDQUFDLGFBQWEsS0FBSyxXQUFXLEVBQUU7WUFDM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxHQUFHLHFCQUFxQixDQUFDO1lBQ3JELFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztTQUNqRDtRQUNELElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDN0M7SUFDRCx5QkFBeUIsRUFBRSxTQUFTLEtBQUssRUFBRTtRQUN2QyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDeEM7SUFDRCxvQkFBb0IsRUFBRSxZQUFZO1FBQzlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztLQUNqRDtJQUNELGtCQUFrQixFQUFFLFdBQVc7UUFDM0IsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDNUM7SUFDRCxLQUFLLEVBQUUsV0FBVztRQUNkLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztLQUNsQztJQUNELElBQUksRUFBRSxXQUFXO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO0tBQ2pDO0lBQ0QsWUFBWSxFQUFFLFVBQVUsS0FBSyxFQUFFLEtBQUssRUFBRTtRQUNsQyxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsb0JBQUMsTUFBTSxFQUFBLGdCQUFBLEdBQUEsQ0FBRSxHQUFHLEtBQUssRUFBQyxDQUFFLEdBQUcsS0FBSyxFQUFDLENBQUMsQ0FBQSxLQUFBLEVBQUssQ0FBRSxJQUFJLENBQUMsS0FBSyxFQUFDLENBQUMsSUFBQSxFQUFJLENBQUUsSUFBSSxDQUFDLElBQUssQ0FBQSxDQUFFLENBQUEsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7S0FDdEg7SUFDRCxNQUFNLEVBQUUsWUFBWTtRQUNoQixPQUFPLElBQUksQ0FBQztLQUNmO0NBQ0osQ0FBQzs7O0FDdENGLFNBQVMsUUFBUSxFQUFFLFNBQVMsRUFBRSxPQUFPLEdBQUc7QUFDeEMsSUFBSSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDOztJQUUzQixJQUFJLEVBQUUsQ0FBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUc7UUFDaEMsT0FBTztBQUNmLEtBQUs7O0lBRUQsSUFBSSxFQUFFLElBQUksRUFBRSxHQUFHO1FBQ1gsU0FBUyxHQUFHLEdBQUcsQ0FBQyxTQUFTLENBQUM7S0FDN0I7SUFDRCxPQUFPLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUM7QUFDckMsQ0FBQzs7QUFFRCxTQUFTLFdBQVcsRUFBRSxTQUFTLEVBQUUsT0FBTyxHQUFHO0lBQ3ZDLElBQUksRUFBRSxHQUFHLE9BQU8sQ0FBQyxTQUFTLENBQUM7SUFDM0IsSUFBSSxHQUFHLEdBQUcsSUFBSSxNQUFNLEVBQUUsU0FBUyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDdkQsRUFBRSxHQUFHLEVBQUUsQ0FBQyxPQUFPLEVBQUUsR0FBRyxFQUFFLEVBQUUsRUFBRSxDQUFDO0lBQzNCLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQzNCLENBQUM7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLFFBQVEsRUFBRSxRQUFRO0lBQ2xCLFdBQVcsRUFBRSxXQUFXO0NBQzNCOzs7QUN2QkQsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7QUFDOUMsSUFBSSxXQUFXLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUM7O0FBRTlDLG9DQUFvQyx1QkFBQTtJQUNoQyxlQUFlLEVBQUUsU0FBUztJQUMxQixpQkFBaUIsRUFBRSxXQUFXO1FBQzFCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUssSUFBSSxFQUFFO1lBQzVCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztTQUNyQjtLQUNKO0lBQ0Qsa0JBQWtCLEVBQUUsVUFBVTtRQUMxQixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFO1lBQ25CLFdBQVcsQ0FBQyxRQUFRLENBQUMsWUFBWSxFQUFFLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsRCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7U0FDckIsTUFBTTtZQUNILElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUNwQixXQUFXLENBQUMsV0FBVyxDQUFDLFlBQVksRUFBRSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7U0FDeEQ7S0FDSjtJQUNELFVBQVUsRUFBRSxVQUFVLEtBQUssRUFBRTtRQUN6QixRQUFRLEtBQUssQ0FBQyxPQUFPO1lBQ2pCLEtBQUssRUFBRTtnQkFDSCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDO2dCQUNuQixLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7Z0JBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztnQkFDdkIsTUFBTTtZQUNWLEtBQUssQ0FBQztnQkFDRixJQUFJLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO29CQUNwQyxLQUFLLENBQUMsZUFBZSxFQUFFLENBQUM7b0JBQ3hCLEtBQUssQ0FBQyxjQUFjLEVBQUUsQ0FBQztpQkFDMUI7Z0JBQ0QsTUFBTTtTQUNiO0tBQ0o7SUFDRCxhQUFhLEVBQUUsVUFBVSxRQUFRLEVBQUU7UUFDL0IsSUFBSSxTQUFTLEdBQUcsV0FBVyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFDO1FBQzFFLElBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7WUFDeEIsT0FBTztBQUNuQixTQUFTOztRQUVELElBQUksaUJBQWlCLEdBQUcsUUFBUSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMxRixRQUFRLElBQUksWUFBWSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUM7O1FBRTFDLElBQUksWUFBWSxLQUFLLGlCQUFpQixFQUFFO1lBQ3BDLElBQUksZUFBZSxHQUFHLFFBQVEsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEYsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ3hCLE9BQU8sSUFBSSxDQUFDO1NBQ2Y7UUFDRCxPQUFPLEtBQUssQ0FBQztLQUNoQjtJQUNELFVBQVUsRUFBRSxXQUFXO1FBQ25CLElBQUksQ0FBQyxlQUFlLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQztRQUM5QyxJQUFJLFNBQVMsR0FBRyxXQUFXLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDMUUsSUFBSSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUN0QixTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDeEI7S0FDSjtJQUNELFlBQVksRUFBRSxXQUFXO1FBQ3JCLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN0QixJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQyxlQUFlLEdBQUcsU0FBUyxDQUFDO1NBQ3BDO0tBQ0o7SUFDRCxNQUFNLEVBQUUsWUFBWTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUU7WUFDcEIsT0FBTyxJQUFJLENBQUM7QUFDeEIsU0FBUzs7UUFFRCxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztRQUNuQyxHQUFHLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsRUFBRTtZQUNuQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNsQyxTQUFTOztRQUVELFFBQVEsR0FBRyxRQUFRLENBQUMsR0FBRyxDQUFDLFNBQVMsS0FBSyxDQUFDO1lBQ25DLEtBQUssQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDO1lBQ25DLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3JDLE9BQU8sS0FBSyxDQUFDO1NBQ2hCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7UUFDZDtZQUNJLG9CQUFBLEtBQUksRUFBQSxDQUFBLENBQUMsUUFBQSxFQUFRLENBQUMsSUFBQSxFQUFJLENBQUMsU0FBQSxFQUFTLENBQUUsSUFBSSxDQUFDLFVBQVksQ0FBQSxFQUFBO2dCQUMzQyxvQkFBQSxLQUFJLEVBQUEsQ0FBQSxDQUFDLFNBQUEsRUFBUyxDQUFDLFVBQUEsRUFBVSxDQUFDLE9BQUEsRUFBTyxDQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBTyxDQUFNLENBQUEsRUFBQTtnQkFDM0Qsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxXQUFZLENBQUEsRUFBQTtvQkFDdkIsb0JBQUEsS0FBSSxFQUFBLENBQUEsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxTQUFBLEVBQVMsQ0FBQyxHQUFBLEVBQUcsQ0FBQyxTQUFVLENBQUEsRUFBQTt3QkFDbEMsUUFBUztvQkFDUixDQUFBO2dCQUNKLENBQUE7WUFDSixDQUFBO1VBQ1I7S0FDTDtDQUNKLENBQUM7OztBQ3pGRixTQUFTLFNBQVMsQ0FBQyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUU7SUFDMUMsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUM5QyxPQUFPLENBQUMscUNBQXFDLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNwRCxDQUFDLE9BQU8sQ0FBQyxRQUFRO1lBQ2pCLEdBQUcsS0FBSyxRQUFRO1lBQ2hCLE9BQU8sQ0FBQyxJQUFJLElBQUksZ0JBQWdCO2dCQUM1QixnQkFBZ0IsS0FBSyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7Q0FDckQ7QUFDRCxTQUFTLE1BQU0sQ0FBQyxFQUFFLEVBQUU7SUFDaEIsT0FBTyxDQUFDLEVBQUUsQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxZQUFZLElBQUksQ0FBQztRQUMvQyxFQUFFLENBQUMsS0FBSyxDQUFDLE9BQU8sS0FBSyxNQUFNLENBQUM7QUFDcEMsQ0FBQzs7QUFFRCxTQUFTLE9BQU8sQ0FBQyxPQUFPLEVBQUU7SUFDdEIsT0FBTyxPQUFPLEVBQUU7UUFDWixJQUFJLE9BQU8sS0FBSyxRQUFRLENBQUMsSUFBSSxFQUFFLE1BQU07UUFDckMsSUFBSSxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsT0FBTyxLQUFLLENBQUM7UUFDbEMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FDaEM7SUFDRCxPQUFPLElBQUksQ0FBQztDQUNmO0FBQ0QsU0FBUyxRQUFRLENBQUMsT0FBTyxFQUFFO0lBQ3ZCLElBQUksUUFBUSxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDaEQsSUFBSSxRQUFRLEtBQUssSUFBSSxFQUFFLFFBQVEsR0FBRyxTQUFTLENBQUM7SUFDNUMsSUFBSSxhQUFhLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sQ0FBQyxhQUFhLElBQUksUUFBUSxJQUFJLENBQUMsS0FBSyxTQUFTLENBQUMsT0FBTyxFQUFFLENBQUMsYUFBYSxDQUFDLENBQUM7Q0FDakY7QUFDRCxTQUFTLGFBQWEsQ0FBQyxTQUFTLEVBQUU7SUFDOUIsT0FBTyxFQUFFLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsZ0JBQWdCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFVBQVUsT0FBTyxFQUFFO1FBQy9FLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztLQUMzQixDQUFDLENBQUM7QUFDUCxDQUFDO0FBQ0Q7O0FBRUEsTUFBTSxDQUFDLE9BQU8sR0FBRztJQUNiLGFBQWEsRUFBRSxhQUFhO0NBQy9CIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsInZhciBQb3J0YWwgPSByZXF1aXJlKCcuL1BvcnRhbC5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHBvcnRhbEVsZW1lbnRQcmVmaXg6ICdSZWFjdE1vZGFsJyxcbiAgICAgICAgICAgIGlzT3BlbjogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wb3J0YWxFbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wb3J0YWxFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICB0aGlzLnBvcnRhbEVsZW1lbnQuY2xhc3NOYW1lID0gXCJSZWFjdE1vZGFsQ29udGFpbmVyXCI7XG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucG9ydGFsRWxlbWVudCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZW5kZXJQb3J0YWwodGhpcy5wcm9wcywgdGhpcy5zdGF0ZSk7XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICB0aGlzLnJlbmRlclBvcnRhbChwcm9wcywgdGhpcy5zdGF0ZSk7XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsVW5tb3VudDogZnVuY3Rpb24gKCkge1xuICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMucG9ydGFsRWxlbWVudCk7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnJlbmRlclBvcnRhbCh0aGlzLnByb3BzLCB0aGlzLnN0YXRlKVxuICAgIH0sXG4gICAgY2xvc2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc09wZW46IGZhbHNlfSk7XG4gICAgfSxcbiAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiB0cnVlfSk7XG4gICAgfSxcbiAgICByZW5kZXJQb3J0YWw6IGZ1bmN0aW9uIChwcm9wcywgc3RhdGUpIHtcbiAgICAgICAgdGhpcy5tb2RhbCA9IFJlYWN0LnJlbmRlcig8UG9ydGFsIHsuLi5wcm9wc30gey4uLnN0YXRlfSBjbG9zZT17dGhpcy5jbG9zZX0gb3Blbj17dGhpcy5vcGVufS8+LCB0aGlzLnBvcnRhbEVsZW1lbnQpO1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn0pOyIsImZ1bmN0aW9uIGFkZENsYXNzKCBjbGFzc25hbWUsIGVsZW1lbnQgKSB7XHJcbiAgICB2YXIgY24gPSBlbGVtZW50LmNsYXNzTmFtZTtcclxuICAgIC8vdGVzdCBmb3IgZXhpc3RhbmNlXHJcbiAgICBpZiggY24uaW5kZXhPZiggY2xhc3NuYW1lICkgIT0gLTEgKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgLy9hZGQgYSBzcGFjZSBpZiB0aGUgZWxlbWVudCBhbHJlYWR5IGhhcyBjbGFzc1xyXG4gICAgaWYoIGNuICE9ICcnICkge1xyXG4gICAgICAgIGNsYXNzbmFtZSA9ICcgJytjbGFzc25hbWU7XHJcbiAgICB9XHJcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNuK2NsYXNzbmFtZTtcclxufVxyXG5cclxuZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoIGNsYXNzbmFtZSwgZWxlbWVudCApIHtcclxuICAgIHZhciBjbiA9IGVsZW1lbnQuY2xhc3NOYW1lO1xyXG4gICAgdmFyIHJ4cCA9IG5ldyBSZWdFeHAoIFwiXFxcXHM/XFxcXGJcIitjbGFzc25hbWUrXCJcXFxcYlwiLCBcImdcIiApO1xyXG4gICAgY24gPSBjbi5yZXBsYWNlKCByeHAsICcnICk7XHJcbiAgICBlbGVtZW50LmNsYXNzTmFtZSA9IGNuO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuICAgIGFkZENsYXNzOiBhZGRDbGFzcyxcclxuICAgIHJlbW92ZUNsYXNzOiByZW1vdmVDbGFzc1xyXG59OyIsInZhciBGb2N1c0hlbHBlciA9IHJlcXVpcmUoJy4vZm9jdXNIZWxwZXIuanMnKTtcbnZhciBDbGFzc0hlbHBlciA9IHJlcXVpcmUoJy4vQ2xhc3NIZWxwZXIuanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZm9jdXNBZnRlckNsb3NlOiB1bmRlZmluZWQsXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAodGhpcy5wcm9wcy5pc09wZW4gPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNGaXJzdCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlzT3Blbikge1xuICAgICAgICAgICAgQ2xhc3NIZWxwZXIuYWRkQ2xhc3MoJ21vZGFsLW9wZW4nLCBkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNGaXJzdCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZXN0b3JlRm9jdXMoKTtcbiAgICAgICAgICAgIENsYXNzSGVscGVyLnJlbW92ZUNsYXNzKCdtb2RhbC1vcGVuJywgZG9jdW1lbnQuYm9keSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGtleUhhbmRsZXI6IGZ1bmN0aW9uIChldmVudCkge1xuICAgICAgICBzd2l0Y2ggKGV2ZW50LmtleUNvZGUpIHtcbiAgICAgICAgICAgIGNhc2UgMjc6IC8vRVNDXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5jbG9zZSgpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDk6IC8vVGFiXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlVGFiYmluZyhldmVudC5zaGlmdEtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBoYW5kbGVUYWJiaW5nOiBmdW5jdGlvbiAoc2hpZnRLZXkpIHtcbiAgICAgICAgdmFyIHRhYmJhYmxlcyA9IEZvY3VzSGVscGVyLmZpbmRUYWJiYWJsZXModGhpcy5yZWZzLmNvbnRlbnQuZ2V0RE9NTm9kZSgpKTtcbiAgICAgICAgaWYgKHRhYmJhYmxlcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsYXN0VmFsaWRUYWJiYWJsZSA9IHNoaWZ0S2V5ID8gdGFiYmFibGVzWzBdIDogdGFiYmFibGVzW3RhYmJhYmxlcy5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIGN1cnJlbnRGb2N1cyA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG5cbiAgICAgICAgaWYgKGN1cnJlbnRGb2N1cyA9PT0gbGFzdFZhbGlkVGFiYmFibGUpIHtcbiAgICAgICAgICAgIHZhciBuZXdGb2N1c0VsZW1lbnQgPSBzaGlmdEtleSA/IHRhYmJhYmxlc1t0YWJiYWJsZXMubGVuZ3RoIC0gMV0gOiB0YWJiYWJsZXNbMF07XG4gICAgICAgICAgICBuZXdGb2N1c0VsZW1lbnQuZm9jdXMoKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9LFxuICAgIGZvY3VzRmlyc3Q6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLmZvY3VzQWZ0ZXJDbG9zZSA9IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQ7XG4gICAgICAgIHZhciB0YWJiYWJsZXMgPSBGb2N1c0hlbHBlci5maW5kVGFiYmFibGVzKHRoaXMucmVmcy5jb250ZW50LmdldERPTU5vZGUoKSk7XG4gICAgICAgIGlmICh0YWJiYWJsZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdGFiYmFibGVzWzBdLmZvY3VzKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHJlc3RvcmVGb2N1czogZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0aGlzLmZvY3VzQWZ0ZXJDbG9zZSkge1xuICAgICAgICAgICAgdGhpcy5mb2N1c0FmdGVyQ2xvc2UuZm9jdXMoKTtcbiAgICAgICAgICAgIHRoaXMuZm9jdXNBZnRlckNsb3NlID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCF0aGlzLnByb3BzLmlzT3Blbikge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuO1xuICAgICAgICBpZighY2hpbGRyZW4uaGFzT3duUHJvcGVydHkoJ2xlbmd0aCcpKSB7XG4gICAgICAgICAgICBjaGlsZHJlbiA9IFtjaGlsZHJlbl07XG4gICAgICAgIH1cblxuICAgICAgICBjaGlsZHJlbiA9IGNoaWxkcmVuLm1hcChmdW5jdGlvbihjaGlsZCl7XG4gICAgICAgICAgICBjaGlsZC5wcm9wcy5vcGVuID0gdGhpcy5wcm9wcy5vcGVuO1xuICAgICAgICAgICAgY2hpbGQucHJvcHMuY2xvc2UgPSB0aGlzLnByb3BzLmNsb3NlO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkO1xuICAgICAgICB9LmJpbmQodGhpcykpO1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiB0YWJJbmRleD1cIi0xXCIgb25LZXlEb3duPXt0aGlzLmtleUhhbmRsZXJ9PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYmFja2Ryb3BcIiBvbkNsaWNrPXt0aGlzLnByb3BzLmNsb3NlfT48L2Rpdj5cbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlcmluZ1wiPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbnRlbnRcIiByZWY9XCJjb250ZW50XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICB7Y2hpbGRyZW59XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7IiwiZnVuY3Rpb24gZm9jdXNhYmxlKGVsZW1lbnQsIGlzVGFiSW5kZXhOb3ROYU4pIHtcbiAgICB2YXIgbm9kZU5hbWUgPSBlbGVtZW50Lm5vZGVOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgcmV0dXJuICgvaW5wdXR8c2VsZWN0fHRleHRhcmVhfGJ1dHRvbnxvYmplY3QvLnRlc3Qobm9kZU5hbWUpID9cbiAgICAgICAgICAgICFlbGVtZW50LmRpc2FibGVkIDpcbiAgICAgICAgICAgIFwiYVwiID09PSBub2RlTmFtZSA/XG4gICAgICAgICAgICBlbGVtZW50LmhyZWYgfHwgaXNUYWJJbmRleE5vdE5hTiA6XG4gICAgICAgICAgICAgICAgaXNUYWJJbmRleE5vdE5hTikgJiYgdmlzaWJsZShlbGVtZW50KTtcbn1cbmZ1bmN0aW9uIGhpZGRlbihlbCkge1xuICAgIHJldHVybiAoZWwub2Zmc2V0V2lkdGggPD0gMCAmJiBlbC5vZmZzZXRIZWlnaHQgPD0gMCkgfHxcbiAgICAgICAgZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnO1xufVxuXG5mdW5jdGlvbiB2aXNpYmxlKGVsZW1lbnQpIHtcbiAgICB3aGlsZSAoZWxlbWVudCkge1xuICAgICAgICBpZiAoZWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkgYnJlYWs7XG4gICAgICAgIGlmIChoaWRkZW4oZWxlbWVudCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgZWxlbWVudCA9IGVsZW1lbnQucGFyZW50Tm9kZTtcbiAgICB9XG4gICAgcmV0dXJuIHRydWU7XG59XG5mdW5jdGlvbiB0YWJiYWJsZShlbGVtZW50KSB7XG4gICAgdmFyIHRhYkluZGV4ID0gZWxlbWVudC5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4Jyk7XG4gICAgaWYgKHRhYkluZGV4ID09PSBudWxsKSB0YWJJbmRleCA9IHVuZGVmaW5lZDtcbiAgICB2YXIgaXNUYWJJbmRleE5hTiA9IGlzTmFOKHRhYkluZGV4KTtcbiAgICByZXR1cm4gKGlzVGFiSW5kZXhOYU4gfHwgdGFiSW5kZXggPj0gMCkgJiYgZm9jdXNhYmxlKGVsZW1lbnQsICFpc1RhYkluZGV4TmFOKTtcbn1cbmZ1bmN0aW9uIGZpbmRUYWJiYWJsZXMoY29udGFpbmVyKSB7XG4gICAgcmV0dXJuIFtdLnNsaWNlLmNhbGwoY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3JBbGwoJyonKSwgMCkuZmlsdGVyKGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIHJldHVybiB0YWJiYWJsZShlbGVtZW50KVxuICAgIH0pO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIGZpbmRUYWJiYWJsZXM6IGZpbmRUYWJiYWJsZXNcbn07Il19

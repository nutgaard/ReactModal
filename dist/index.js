!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Modal=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"./src/index.js":[function(require,module,exports){
var Portal = require('./Portal.js');

module.exports = React.createClass({displayName: "exports",
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
        this.modal = React.render(React.createElement(Portal, React.__spread({},  props)), this.portalElement);
    },
    render: function () {
        return null;
    }
});

},{"./Portal.js":"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\Portal.js"}],"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\Portal.js":[function(require,module,exports){
var FocusHelper = require('./focusHelper.js');

module.exports = React.createClass({displayName: "exports",
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
            React.createElement("div", {tabIndex: "-1", onKeyDown: this.keyHandler}, 
                React.createElement("div", {className: "backdrop", onClick: this.close}), 
                React.createElement("div", {className: "centering"}, 
                    React.createElement("div", {className: "content", ref: "content"}, 
                        this.props.children
                    )
                )
            )
        );
    }
});

},{"./focusHelper.js":"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\focusHelper.js"}],"C:\\Users\\Nicklas\\IdeaProjects\\ReactModal\\src\\focusHelper.js":[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwiQzpcXFVzZXJzXFxOaWNrbGFzXFxJZGVhUHJvamVjdHNcXFJlYWN0TW9kYWxcXHNyY1xcaW5kZXguanMiLCJDOlxcVXNlcnNcXE5pY2tsYXNcXElkZWFQcm9qZWN0c1xcUmVhY3RNb2RhbFxcc3JjXFxQb3J0YWwuanMiLCJDOlxcVXNlcnNcXE5pY2tsYXNcXElkZWFQcm9qZWN0c1xcUmVhY3RNb2RhbFxcc3JjXFxmb2N1c0hlbHBlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBLElBQUksTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQzs7QUFFcEMsb0NBQW9DLHVCQUFBO0lBQ2hDLGVBQWUsRUFBRSxZQUFZO1FBQ3pCLE9BQU87WUFDSCxtQkFBbUIsRUFBRSxZQUFZO1NBQ3BDLENBQUM7S0FDTDtJQUNELGlCQUFpQixFQUFFLFlBQVk7UUFDM0IsSUFBSSxPQUFPLElBQUksQ0FBQyxhQUFhLEtBQUssV0FBVyxFQUFFO1lBQzNDLElBQUksQ0FBQyxhQUFhLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuRCxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsR0FBRyxxQkFBcUIsQ0FBQztZQUNyRCxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7U0FDakQ7UUFDRCxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNqQztJQUNELHlCQUF5QixFQUFFLFNBQVMsS0FBSyxFQUFFO1FBQ3ZDLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUI7SUFDRCxvQkFBb0IsRUFBRSxZQUFZO1FBQzlCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxhQUFh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LEtBQUssQ0FBQyxPQUFPLEtBQUssTUFBTSxDQUFDO0FBQ3BDLENBQUM7O0FBRUQsU0FBUyxPQUFPLENBQUMsT0FBTyxFQUFFO0lBQ3RCLE9BQU8sT0FBTyxFQUFFO1FBQ1osSUFBSSxPQUFPLEtBQUssUUFBUSxDQUFDLElBQUksRUFBRSxNQUFNO1FBQ3JDLElBQUksTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLE9BQU8sS0FBSyxDQUFDO1FBQ2xDLE9BQU8sR0FBRyxPQUFPLENBQUMsVUFBVSxDQUFDO0tBQ2hDO0lBQ0QsT0FBTyxJQUFJLENBQUM7Q0FDZjtBQUNELFNBQVMsUUFBUSxDQUFDLE9BQU8sRUFBRTtJQUN2QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQ2hELElBQUksUUFBUSxLQUFLLElBQUksRUFBRSxRQUFRLEdBQUcsU0FBUyxDQUFDO0lBQzVDLElBQUksYUFBYSxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUNwQyxPQUFPLENBQUMsYUFBYSxJQUFJLFFBQVEsSUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLE9BQU8sRUFBRSxDQUFDLGFBQWEsQ0FBQyxDQUFDO0NBQ2pGO0FBQ0QsU0FBUyxhQUFhLENBQUMsU0FBUyxFQUFFO0lBQzlCLE9BQU8sRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxVQUFVLE9BQU8sRUFBRTtRQUMvRSxPQUFPLFFBQVEsQ0FBQyxPQUFPLENBQUM7S0FDM0IsQ0FBQyxDQUFDO0FBQ1AsQ0FBQztBQUNEOztBQUVBLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDYixhQUFhLEVBQUUsYUFBYTtDQUMvQiIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJ2YXIgUG9ydGFsID0gcmVxdWlyZSgnLi9Qb3J0YWwuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgcG9ydGFsRWxlbWVudFByZWZpeDogJ1JlYWN0TW9kYWwnXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy5wb3J0YWxFbGVtZW50ID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICB0aGlzLnBvcnRhbEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICAgICAgdGhpcy5wb3J0YWxFbGVtZW50LmNsYXNzTmFtZSA9IFwiUmVhY3RNb2RhbENvbnRhaW5lclwiO1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMucG9ydGFsRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucmVuZGVyUG9ydGFsKHRoaXMucHJvcHMpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJQb3J0YWwocHJvcHMpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxVbm1vdW50OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh0aGlzLnBvcnRhbEVsZW1lbnQpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlclBvcnRhbDogZnVuY3Rpb24gKHByb3BzKSB7XHJcbiAgICAgICAgdGhpcy5tb2RhbCA9IFJlYWN0LnJlbmRlcig8UG9ydGFsIHsuLi5wcm9wc30gLz4sIHRoaXMucG9ydGFsRWxlbWVudCk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcbn0pOyIsInZhciBGb2N1c0hlbHBlciA9IHJlcXVpcmUoJy4vZm9jdXNIZWxwZXIuanMnKTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgZm9jdXNBZnRlckNsb3NlOiBudWxsLFxyXG4gICAgICAgICAgICBpc09wZW46IHRydWVcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLmlzT3Blbikge1xyXG4gICAgICAgICAgICB0aGlzLm9wZW4oKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24gKG5ld1Byb3BzKSB7XHJcbiAgICAgICAgaWYgKG5ld1Byb3BzLmhhc093blByb3BlcnR5KCdpc09wZW4nKSAmJiBuZXdQcm9wcy5pc09wZW4gPT09IHRydWUpIHtcclxuICAgICAgICAgICAgdGhpcy5vcGVuKCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5jbG9zZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvcGVuOiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7aXNPcGVuOiB0cnVlfSk7XHJcbiAgICB9LFxyXG4gICAgY2xvc2U6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHtpc09wZW46IGZhbHNlfSk7XHJcbiAgICB9LFxyXG4gICAga2V5SGFuZGxlcjogZnVuY3Rpb24gKGV2ZW50KSB7XHJcbiAgICAgICAgc3dpdGNoIChldmVudC5rZXlDb2RlKSB7XHJcbiAgICAgICAgICAgIGNhc2UgMjc6IC8vRVNDXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsb3NlKCk7XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSA5OiAvL1RhYlxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaGFuZGxlVGFiYmluZyhldmVudC5zaGlmdEtleSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIGhhbmRsZVRhYmJpbmc6IGZ1bmN0aW9uIChzaGlmdEtleSkge1xyXG4gICAgICAgIHZhciB0YWJiYWJsZXMgPSBGb2N1c0hlbHBlci5maW5kVGFiYmFibGVzKHRoaXMucmVmcy5jb250ZW50LmdldERPTU5vZGUoKSk7XHJcbiAgICAgICAgaWYgKHRhYmJhYmxlcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGxhc3RWYWxpZFRhYmJhYmxlID0gc2hpZnRLZXkgPyB0YWJiYWJsZXNbMF0gOiB0YWJiYWJsZXNbdGFiYmFibGVzLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgIHZhciBjdXJyZW50Rm9jdXMgPSBkb2N1bWVudC5hY3RpdmVFbGVtZW50O1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudEZvY3VzID09PSBsYXN0VmFsaWRUYWJiYWJsZSkge1xyXG4gICAgICAgICAgICB2YXIgbmV3Rm9jdXNFbGVtZW50ID0gc2hpZnRLZXkgPyB0YWJiYWJsZXNbdGFiYmFibGVzLmxlbmd0aCAtIDFdIDogdGFiYmFibGVzWzBdO1xyXG4gICAgICAgICAgICBuZXdGb2N1c0VsZW1lbnQuZm9jdXMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICBpZiAoIXRoaXMuc3RhdGUuaXNPcGVuKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IHRhYkluZGV4PVwiLTFcIiBvbktleURvd249e3RoaXMua2V5SGFuZGxlcn0+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJhY2tkcm9wXCIgb25DbGljaz17dGhpcy5jbG9zZX0+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNlbnRlcmluZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29udGVudFwiIHJlZj1cImNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY2hpbGRyZW59XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7IiwiZnVuY3Rpb24gZm9jdXNhYmxlKGVsZW1lbnQsIGlzVGFiSW5kZXhOb3ROYU4pIHtcclxuICAgIHZhciBub2RlTmFtZSA9IGVsZW1lbnQubm9kZU5hbWUudG9Mb3dlckNhc2UoKTtcclxuICAgIHJldHVybiAoL2lucHV0fHNlbGVjdHx0ZXh0YXJlYXxidXR0b258b2JqZWN0Ly50ZXN0KG5vZGVOYW1lKSA/XHJcbiAgICAgICAgICAgICFlbGVtZW50LmRpc2FibGVkIDpcclxuICAgICAgICAgICAgXCJhXCIgPT09IG5vZGVOYW1lID9cclxuICAgICAgICAgICAgZWxlbWVudC5ocmVmIHx8IGlzVGFiSW5kZXhOb3ROYU4gOlxyXG4gICAgICAgICAgICAgICAgaXNUYWJJbmRleE5vdE5hTikgJiYgdmlzaWJsZShlbGVtZW50KTtcclxufVxyXG5mdW5jdGlvbiBoaWRkZW4oZWwpIHtcclxuICAgIHJldHVybiAoZWwub2Zmc2V0V2lkdGggPD0gMCAmJiBlbC5vZmZzZXRIZWlnaHQgPD0gMCkgfHxcclxuICAgICAgICBlbC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZSc7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHZpc2libGUoZWxlbWVudCkge1xyXG4gICAgd2hpbGUgKGVsZW1lbnQpIHtcclxuICAgICAgICBpZiAoZWxlbWVudCA9PT0gZG9jdW1lbnQuYm9keSkgYnJlYWs7XHJcbiAgICAgICAgaWYgKGhpZGRlbihlbGVtZW50KSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIGVsZW1lbnQgPSBlbGVtZW50LnBhcmVudE5vZGU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTtcclxufVxyXG5mdW5jdGlvbiB0YWJiYWJsZShlbGVtZW50KSB7XHJcbiAgICB2YXIgdGFiSW5kZXggPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKTtcclxuICAgIGlmICh0YWJJbmRleCA9PT0gbnVsbCkgdGFiSW5kZXggPSB1bmRlZmluZWQ7XHJcbiAgICB2YXIgaXNUYWJJbmRleE5hTiA9IGlzTmFOKHRhYkluZGV4KTtcclxuICAgIHJldHVybiAoaXNUYWJJbmRleE5hTiB8fCB0YWJJbmRleCA+PSAwKSAmJiBmb2N1c2FibGUoZWxlbWVudCwgIWlzVGFiSW5kZXhOYU4pO1xyXG59XHJcbmZ1bmN0aW9uIGZpbmRUYWJiYWJsZXMoY29udGFpbmVyKSB7XHJcbiAgICByZXR1cm4gW10uc2xpY2UuY2FsbChjb250YWluZXIucXVlcnlTZWxlY3RvckFsbCgnKicpLCAwKS5maWx0ZXIoZnVuY3Rpb24gKGVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gdGFiYmFibGUoZWxlbWVudClcclxuICAgIH0pO1xyXG59XHJcblxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBmaW5kVGFiYmFibGVzOiBmaW5kVGFiYmFibGVzXHJcbn07Il19

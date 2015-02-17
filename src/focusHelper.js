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
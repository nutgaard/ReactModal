module.exports = {
    generateId: function (prefix) {
        return (prefix || 'GEN_ID-') + new Date().getTime() + '-' + Math.random();
    }
};
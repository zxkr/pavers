var Column = (function () {
    function Column(node) {
        this.node = node;
        this.height = 0;
    }
    return Column;
}());
var Columns = (function () {
    function Columns(id) {
        // Init count: columns
        this.cols = new Array();
        this.elements = new Array();
        this.parent = document.getElementById(id);
    }
    Columns.prototype.setColumns = function (count) {
        if (this.cols.length > 0)
            this.cols.splice(0);
        for (var i = 0; i < count; i++) {
            var node = document.createElement('div');
            node.setAttribute('class', 'col');
            this.cols.push(new Column(node));
        }
    };
    Columns.prototype.getElements = function () {
        // Get child nodes
        if (this.parent == null)
            return;
        var length = this.parent.children.length;
        for (var i = 0; i < length; i++)
            this.elements.push(this.parent.children[i]);
    };
    Columns.prototype.setElements = function () {
        for (var _i = 0, _a = this.elements; _i < _a.length; _i++) {
            var element = _a[_i];
            var imin = 0, min = Infinity;
            // Find short column
            this.cols.forEach(function (column, index) {
                var height = column.height;
                if (min > height) {
                    imin = index;
                    min = height;
                }
            });
            // Add element to short column
            this.cols[imin].height += element.clientHeight;
            this.cols[imin].node.appendChild(element);
        }
    };
    Columns.prototype.addElements = function () {
        var _this = this;
        this.setElements();
        // Remove old childs
        while (this.parent.firstChild)
            this.parent.removeChild(this.parent.firstChild);
        // Append new childs
        this.cols.forEach(function (v) {
            _this.parent.appendChild(v.node);
        });
    };
    return Columns;
}());
var Pavers = (function () {
    function Pavers(options) {
        this.columnNumber = 0;
        this.options = options;
        this.columns = new Columns(options.container);
        this.columns.getElements();
        this.resize();
        var resizeTimeout;
        var self = this;
        addEventListener('resize', function () {
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(function () {
                    resizeTimeout = null;
                    // The resizeHandler will execute at a rate of 15fps
                    self.resize();
                }, 66);
            }
        }, false);
    }
    Pavers.prototype.resize = function () {
        var _this = this;
        if (this.columns.parent == null)
            return;
        var n = this.getColumnNumber();
        if (this.columnNumber != n) {
            this.columnNumber = n;
            // Lock grid height
            this.columns.parent.setAttribute('style', 'height:' + this.columns.parent.scrollHeight + 'px');
            // Rebuild columns
            this.columns.setColumns(n);
            this.columns.addElements();
            var resizeTimeout = setTimeout(function () {
                resizeTimeout = null;
                // Release grid height
                _this.columns.parent.removeAttribute('style');
            }, 1000);
        }
    };
    Pavers.prototype.getColumnNumber = function () {
        for (var _i = 0, _a = this.options.sizes; _i < _a.length; _i++) {
            var size = _a[_i];
            if (window.matchMedia('(min-width: ' + size.width + 'px)').matches)
                return size.columns;
        }
        return 1;
    };
    return Pavers;
}());
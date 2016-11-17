interface Size {
    columns: number;
    width: number;
}

interface Options {
    container: string;
    sizes: Array<Size>;
}

class Column {
    node: HTMLElement;
    height: number;
    constructor(node: HTMLElement) {
        this.node = node;
        this.height = 0;
    }
}

class Columns {
    cols: Array<Column>;
    elements: Array<Element>;
    parent: HTMLElement;

    constructor(id: string) {
        // Init count: columns
        this.cols = new Array<Column>();
        this.elements = new Array<Element>();
        this.parent = document.getElementById(id);
    }

    setColumns(count: number) {
        if (this.cols.length > 0)
            this.cols.splice(0);
        
        for (let i = 0; i < count; i++) {
            var node = document.createElement('div');
            node.setAttribute('class', 'col');
            
            this.cols.push(new Column(node));
        }
    }

    getElements() {
        // Get child nodes
        if (this.parent == null)
            return;
        
        var length = this.parent.children.length;
        for(let i = 0; i < length; i++)
            this.elements.push(this.parent.children[i]);
    }

    setElements() {
        for (let element of this.elements) {
            var imin = 0, min = Infinity;

            // Find short column
            this.cols.forEach((column, index) => {
                var height = column.height;
                if (min > height) {
                    imin = index
                    min = height
                }
            });
            
            // Add element to short column
            this.cols[imin].height += element.clientHeight;
            this.cols[imin].node.appendChild(element);
        }
    }

    addElements() {
        this.setElements();

        // Remove old childs
        while(this.parent.firstChild)
            this.parent.removeChild(this.parent.firstChild);

        // Append new childs
        this.cols.forEach(v => {
            this.parent.appendChild(v.node);
        });
    }
}

class Pavers {
    // Change this values to customize container and media queries
    public options: Options;
    
    private columnNumber = 0;
    private columns: Columns;

    constructor(options: Options) {
        this.options = options;
        this.columns = new Columns(options.container);
        this.columns.getElements();
        this.resize();

        var resizeTimeout;
        var self = this;
        addEventListener('resize', () => {
            if (!resizeTimeout) {
                resizeTimeout = setTimeout(() => {
                    resizeTimeout = null;
                    // The resizeHandler will execute at a rate of 15fps
                    self.resize();
                }, 66);
            }
        }, false);
    }

    public resize() {
        if (this.columns.parent == null)
            return;

        var n = this.getColumnNumber();
        if (this.columnNumber != n) {
            this.columnNumber = n;
            // Lock grid height
            this.columns.parent.setAttribute('style','height:' + this.columns.parent.scrollHeight + 'px');
            // Rebuild columns
            this.columns.setColumns(n);
            this.columns.addElements();

            var resizeTimeout = setTimeout(() => {
                resizeTimeout = null;
                // Release grid height
                this.columns.parent.removeAttribute('style');
            }, 1000);
        }
    }

    private getColumnNumber(): number {
        for (let size of this.options.sizes)
            if (window.matchMedia('(min-width: ' + size.width + 'px)').matches)
                return size.columns;

        return 1;
    }
}

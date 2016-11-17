# Pavers
Masonry layout library with dynamic columns.

## Getting started

HTML

``` html
<div id="grid">
	<div>...</div>
	<div>...</div>
</div>
...
<script src="pavers.js"></script>
```

JavaScript

``` js
var pavers = new Pavers({
	// container id
    container: 'grid',
    // width in px
    sizes: [{ columns: 4, width: 1200 }, { columns: 3, width: 992 }, { columns: 2, width: 768 }]
});
// make first resize onload
pavers.resize();
```
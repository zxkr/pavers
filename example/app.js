window.onload = function () {
    var pavers = new Pavers({
        container: 'grid',
        sizes: [{ columns: 4, width: 1200 }, { columns: 3, width: 992 }, { columns: 2, width: 768 }]
    });
    pavers.resize();
};
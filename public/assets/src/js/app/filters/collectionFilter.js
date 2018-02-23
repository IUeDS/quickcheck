app.filter('collectionFilter', QcCollectionFilter);

function QcCollectionFilter() {
    return function(collections, searchText) {

        var out = [];

        if (!searchText) {
            out = collections;
        }
        else {
            collections.forEach(function(collection) {
                if (collection.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                    out.push(collection);
                }
            });
        }

        return out;
    };
}
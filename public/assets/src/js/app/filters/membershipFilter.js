app.filter('membershipFilter', QcMembershipFilter);

function QcMembershipFilter() {
    return function(memberships, searchText) {

        var out = [];

        if (!searchText) {
            out = memberships;
        }
        else {
            memberships.forEach(function(membership) {
                if (membership.collection.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1) {
                    out.push(membership);
                }
            });
        }

        return out;
    };
}
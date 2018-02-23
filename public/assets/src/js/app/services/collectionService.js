angular
    .module('collectionService', [])
    .factory('Collection', CollectionService);

CollectionService.$inject = ['$http', 'HttpService'];

function CollectionService($http, HttpService) {
    var service = {
        copyAssessment: copyAssessment,
        createAssessmentGroup: createAssessmentGroup,
        createCollection: createCollection,
        createImportedQuizzes: createImportedQuizzes,
        createMembership: createMembership,
        deleteAssessmentGroup: deleteAssessmentGroup,
        deleteCollection: deleteCollection,
        getCollection: getCollection,
        getCollections: getCollections,
        getCollectionFeatures: getCollectionFeatures,
        getCollectionMembership: getCollectionMembership,
        getCollectionsWithAssessments: getCollectionsWithAssessments,
        getMemberships: getMemberships,
        getMembershipsWithAssessments: getMembershipsWithAssessments,
        getPublicCollections: getPublicCollections,
        quickAdd: quickAdd,
        search: search,
        togglePublic: togglePublic,
        updateAssessmentGroup: updateAssessmentGroup,
        updateCollection: updateCollection,
        updateCollectionMembership: updateCollectionMembership,
        updateFeature: updateFeature
    };

    return service;

    function copyAssessment(id, copyData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'assessment/' + id + '/copy',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(copyData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function createAssessmentGroup(assessmentGroupData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'assessmentgroup',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(assessmentGroupData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function createCollection(collectionData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'collection',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(collectionData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function createImportedQuizzes(quizzes) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'createImportedQuizzes',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(quizzes),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function createMembership(membershipData) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'membership',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(membershipData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function deleteAssessmentGroup(assessmentGroupId) {
        return $http({
            method: 'DELETE',
            url: HttpService.getApiRoot() + 'assessmentgroups/' + assessmentGroupId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function deleteCollection(collectionId) {
        return $http({
            method: 'DELETE',
            url: HttpService.getApiRoot() + 'collection/' + collectionId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getCollection(collectionId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'collection/' + collectionId,
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getCollections() {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'collections',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getCollectionFeatures(collectionId) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'features/collection/' + collectionId,
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getCollectionMembership(collection_id) {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'membership/collection/' + collection_id,
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getCollectionsWithAssessments() {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'collections/assessments',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getMemberships() {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'memberships',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getMembershipsWithAssessments() {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'memberships/assessments',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function getPublicCollections() {
        return $http({
            method: 'GET',
            url: HttpService.getApiRoot() + 'publiccollections',
            timeout: HttpService.getDefaultTimeout()
        });
    }

    //from the home page, quickly add an assessment and potentially a group/collection for it
    function quickAdd(assessment) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'quickadd',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(assessment),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function search(collectionId, searchTerm) {
        return $http({
            method: 'POST',
            url: HttpService.getApiRoot() + 'collection/' + collectionId + '/search',
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param({'searchTerm': searchTerm}),
            timeout: HttpService.getLongTimeout()
        });
    }

    function togglePublic(collection) {
        return $http({
            method: 'PUT',
            url: HttpService.getApiRoot() + 'publiccollection/' + collection.id,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(collection),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function updateAssessmentGroup(assessmentGroupId, assessmentGroupData) {
        return $http({
            method: 'PUT',
            url: HttpService.getApiRoot() + 'assessmentgroups/' + assessmentGroupId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(assessmentGroupData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function updateCollection(collectionId, collectionData) {
        return $http({
            method: 'PUT',
            url: HttpService.getApiRoot() + 'collection/' + collectionId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(collectionData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function updateCollectionMembership(collection_id, membershipData) {
        return $http({
            method: 'PUT',
            url: HttpService.getApiRoot() + 'membership/collection/' + collection_id,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(membershipData),
            timeout: HttpService.getDefaultTimeout()
        });
    }

    function updateFeature(featureId, featureData) {
        return $http({
            method: 'PUT',
            url: HttpService.getApiRoot() + 'feature/' + featureId,
            headers: {'Content-Type' : 'application/x-www-form-urlencoded' },
            data: $.param(featureData),
            timeout: HttpService.getDefaultTimeout()
        });
    }
}
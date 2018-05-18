angular
    .module('editAssessmentConfigFactory', [])
    .factory('EditAssessmentConfig', editAssessmentConfigFactory);


function editAssessmentConfigFactory() {

    var factory = {
        getQuestionTypes: getQuestionTypes,
        getTinyMceConfig: getTinyMceConfig
    };

    return factory;

    //keep question types as constants in one place
    function getQuestionTypes() {
        return {
            multipleChoice: {
                displayName: 'Multiple choice',
                constantName: 'multiple_choice'
            },
            multipleCorrect: {
                displayName: 'Multiple correct (checkboxes)',
                constantName: 'multiple_correct'
            },
            matching: {
                displayName: 'Matching',
                constantName: 'matching'
            },
            matrix: {
                displayName: 'Matrix',
                constantName: 'matrix'
            },
            dropdowns: {
                displayName: 'Multiple dropdowns',
                constantName: 'dropdown'
            },
            textmatch: {
                displayName: 'Text match',
                constantName: 'textmatch'
            },
            numerical: {
                displayName: 'Numerical',
                constantName: 'numerical'
            }
        };
    }

    function getTinyMceConfig() {
        var tinymcePlugins = ['advlist autolink lists link image charmap print hr anchor pagebreak',
            'searchreplace wordcount visualblocks visualchars code',
            'insertdatetime nonbreaking save table contextmenu directionality',
            'paste textcolor colorpicker textpattern imagetools mathquill'];

        var tinymceToolbar = 'undo redo | styleselect | bold italic | alignleft aligncenter ' +
            'alignright alignjustify ltr rtl | bullist numlist outdent indent | link image mathquill';

        return {
            plugins: tinymcePlugins,
            toolbar: tinymceToolbar,
            skin: 'lightgray',
            theme : 'modern',
            default_link_target: '_blank',
            image_advtab: true,
            table_default_attributes: {
                class: 'table table-bordered'
            },
            height: 200
        };
    }
}
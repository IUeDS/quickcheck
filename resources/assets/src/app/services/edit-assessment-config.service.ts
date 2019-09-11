import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EditAssessmentConfigService {

  constructor() { }

    //keep question types as constants in one place
  getQuestionTypes() {
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

  getTinyMceConfig() {
    const tinymcePlugins = ['advlist autolink lists link image charmap print hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code',
      'insertdatetime nonbreaking save table contextmenu directionality',
      'paste textcolor colorpicker textpattern imagetools mathquill'];

    const tinymceToolbar = 'undo redo | styleselect | bold italic | alignleft aligncenter ' +
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

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
      },
      dragAndDrop: {
        displayName: 'Drag and drop',
        constantName: 'drag_and_drop'
      }
    };
  }

  getTinyMceConfig() {
    const tinymcePlugins = ['advlist autolink lists link image charmap print hr anchor pagebreak',
      'searchreplace wordcount visualblocks visualchars code',
      'insertdatetime nonbreaking save table directionality',
      'paste textpattern imagetools mathquill'];

    const tinymceToolbar = 'undo redo | styleselect | bold italic | alignleft aligncenter ' +
      'alignright alignjustify ltr rtl | bullist numlist outdent indent | link image mathquill';

    return {
      base_url: '/assets/dist/browser/tinymce',
      suffix: '.min',
      plugins: tinymcePlugins,
      toolbar: tinymceToolbar,
      theme : 'silver',
      default_link_target: '_blank',
      image_advtab: true,
      table_default_attributes: {
        class: 'table table-bordered'
      },
      height: 300,
      images_upload_url: '/api/assessment/imageupload',
      selector: '#editor',
      setup: (editor) => {
        //need to add custom class on focus for accessibility outline styling
        editor.on('focus', () => {
          // Find the TinyMCE container and add our custom class
          editor.getContainer().classList.add('is-focused');
        });
        editor.on('blur', () => {
          // Remove it when the user leaves
          editor.getContainer().classList.remove('is-focused');
        });
      },
    };
  }
}

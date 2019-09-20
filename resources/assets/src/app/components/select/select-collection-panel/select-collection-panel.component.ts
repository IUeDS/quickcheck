import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'qc-select-collection-panel',
  templateUrl: './select-collection-panel.component.html',
  styleUrls: ['./select-collection-panel.component.scss']
})
export class SelectCollectionPanelComponent implements OnInit {
  @Input() collection;
  @Input() membership;
  @Input() redirectUrl;
  @Input() launchUrlStem;

  constructor() { }

  ngOnInit() {
  }

  createContentItemJson(assessment) {
    var contentItemJson = {
      '@context': 'http://purl.imsglobal.org/ctx/lti/v1/ContentItem',
      '@graph': [
        {
          '@type': 'LtiLinkItem',
          '@id': this.launchUrlStem + assessment.id,
          'url': this.launchUrlStem + assessment.id,
          'title': assessment.name,
          'text': 'Quick Check',
          'mediaType': 'application/vnd.ims.lti.v1.ltilink',
          'placementAdvice': {
            'presentationDocumentTarget': 'frame'
          }
        }
      ]
    };

    return JSON.stringify(contentItemJson);
  }

}

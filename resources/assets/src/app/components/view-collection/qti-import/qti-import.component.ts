import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import { CollectionService } from '../../../services/collection.service';

@Component({
  selector: 'qc-qti-import',
  templateUrl: './qti-import.component.html',
  styleUrls: ['./qti-import.component.scss']
})
export class QtiImportComponent implements OnInit {
  @Input() assessmentGroups;
  @Input() isImportingQti;
  @Output() onQtiImportCancel = new EventEmitter();

  alertKey: string = 'viewSetError';
  qtiImportErrorKey: string = 'qtiImportError';
  qtiImportCriticalNoticeKey: string = 'qtiImportCriticalNotice';
  qtiImportNoticeKey: string = 'qtiImportNotice';
  qtiImportSuccessKey: string = 'qtiImportSuccess';
  assessmentGroupId = null;
  criticalNotices = [];
  done = false;
  error;
  notices = [];
  quizzes = [];
  uploading = false;
  zipFile = null;

  constructor(private collectionService: CollectionService, public utilitiesService: UtilitiesService) { }

  ngOnInit() {
    this.utilitiesService.setLtiHeight();
  }

  cancelQtiImport() {
    this.isImportingQti = false;
    this.onQtiImportCancel.emit({ canceled: true});
  }

  handleFileInput(files: FileList) {
    //source: https://stackoverflow.com/questions/47936183/angular-file-upload
    this.zipFile = files.item(0);
  }

  importQti() {
    if (this.zipFile) {
      this.uploadFile(this.zipFile);
    }
  }

  resetQtiImport() {
    this.assessmentGroupId = null;
    this.criticalNotices = [];
    this.done = false;
    this.error = false;
    this.notices = [];
    this.quizzes = [];
    this.uploading = false;
    this.zipFile = null;
    this.utilitiesService.clearAlert(this.qtiImportErrorKey);
    this.utilitiesService.clearAlert(this.qtiImportCriticalNoticeKey);
    this.utilitiesService.clearAlert(this.qtiImportNoticeKey);
    this.utilitiesService.clearAlert(this.qtiImportSuccessKey);
    this.utilitiesService.setLtiHeight();
  }

  async saveImportQuizzes() {
    let data;
    this.uploading = true;
    this.done = false;

    try {
      const resp = await this.collectionService.createImportedQuizzes({ 'quizzes': this.quizzes });
      data = this.utilitiesService.getResponseData(resp);
    }
    catch (error) {
      this.utilitiesService.showError(error, this.alertKey);
      return;
    }

    this.quizzes = data.quizzes;
    this.uploading = false;
    this.done = true;
    this.notices = [];
    this.criticalNotices = [];
  }

  async uploadFile(file) {
    let resp;
    let data;
    this.uploading = true;

    try {
      resp = await this.collectionService.importQti(file, this.assessmentGroupId);
    }
    catch (error) {
      this.uploading = false;
      this.done = true;
      this.error = this.utilitiesService.getError(error);
      this.utilitiesService.showAlert(this.qtiImportErrorKey, `Error importing QTI package: ${this.error}`, null, { variant: 'danger', focus: true });
      return;
    }

    this.uploading = false;
    this.done = true;
    if (!this.utilitiesService.isSuccessResponse(resp)) {
      this.error = this.utilitiesService.getError(resp);
      this.utilitiesService.showAlert(this.qtiImportErrorKey, `Error importing QTI package: ${this.error}`, null, { variant: 'danger', focus: true });
      return;
    }

    data = this.utilitiesService.getResponseData(resp);
    const warnings = data.warnings;
    if (warnings.critical.length) {
      this.criticalNotices = warnings.critical;
      this.utilitiesService.showAlert(this.qtiImportCriticalNoticeKey, `Error importing one or more quizzes. Please review the critical notices and save quizzes that were imported successfully, if desired.`, this.criticalNotices, { variant: 'danger', focus: true });  
    }
    if (warnings.notices.length) {
      this.notices = warnings.notices;
      this.utilitiesService.showAlert(this.qtiImportNoticeKey, `QTI package imported with some minor issues. Please review the notices for details.`, warnings.notices, { variant: 'warning' });
    }

    if (!warnings.critical.length && !warnings.notices.length) {
      this.utilitiesService.showAlert(this.qtiImportSuccessKey, `QTI package imported successfully.`, null, { variant: 'success' });
    }
    
    this.quizzes = data.quizzes;
  }

}

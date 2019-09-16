import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  constructor(private httpClient: HttpClient, private httpService: HttpService) {}

  async copyAssessment(id, copyData) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessment/' + id + '/copy';

    return await this.httpClient.post(path, copyData)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async createAssessmentGroup(data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessmentgroup';

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async createCollection(data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collection';

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async createImportedQuizzes(data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/createImportedQuizzes';

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async createMembership(data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/membership';

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async deleteAssessmentGroup(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessmentgroups/' + id;

    return await this.httpClient.delete(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async deleteCollection(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collection/' + id;

    return await this.httpClient.delete(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getCollection(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collection/' + id;

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getCollections() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collections';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getCollectionsWithAssessments() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collections/assessments';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getCollectionFeatures(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/features/collection/' + id;

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getCollectionMembership(id) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/membership/collection/' + id;

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getMemberships() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/memberships';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getMembershipsWithAssessments() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/memberships/assessments';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async getPublicCollections() {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/publiccollections';

    return await this.httpClient.get(path)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async importQti(file, assessmentGroupId) {
    const timeoutLength = this.httpService.getLongTimeout();
    const path = this.httpService.getApiRoute() + '/importQTI';
    const data = { 'importFile': file, 'assessment_group_id': assessmentGroupId };

    return await this.httpClient.post(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async quickAdd(assessment) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/quickadd';
    const options = this.httpService.getFormHttpOptions();

    return await this.httpClient.post(path, assessment)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async search(id, searchTerm) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collection/' + id + '/search';

    return await this.httpClient.post(path, { searchTerm })
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async togglePublic(collection) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/publiccollection/' + collection.id;

    return await this.httpClient.put(path, collection)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async updateAssessmentGroup(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/assessmentgroups/' + id;

    return await this.httpClient.put(path,  data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async updateCollection(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/collection/' + id;
    const options = this.httpService.getFormHttpOptions();

    return await this.httpClient.put(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async updateCollectionMembership(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/membership/collection/' + id;

    return await this.httpClient.put(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }

  async updateFeature(id, data) {
    const timeoutLength = this.httpService.getDefaultTimeout();
    const path = this.httpService.getApiRoute() + '/feature/' + id;

    return await this.httpClient.put(path, data)
      .pipe(timeout(timeoutLength))
      .toPromise();
  }
}

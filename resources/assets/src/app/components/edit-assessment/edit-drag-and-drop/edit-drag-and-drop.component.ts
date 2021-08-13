import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { UtilitiesService } from '../../../services/utilities.service';
import { fabric } from 'fabric'; 

@Component({
  selector: 'qc-edit-drag-and-drop',
  templateUrl: './edit-drag-and-drop.component.html',
  styleUrls: ['./edit-drag-and-drop.component.scss']
})
export class EditDragAndDropComponent implements OnInit {
  @Input() question;
  @Input() readOnly;
  @Output() onQuestionEdited = new EventEmitter();
  @Output() onSavedOptionDeleted = new EventEmitter();

  tinymceOptions;
  DRAG_TYPE = 'DRAGGABLE';
  DROP_TYPE = 'DROPPABLE';
  IMAGE_TYPE = 'IMAGE'; //the base image
  image = null;
  draggables = [];
  droppables = [];

  constructor(private editAssessmentConfig: EditAssessmentConfigService, public utilitiesService: UtilitiesService) { 
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit(): void {
    for (const option of this.question.options) {
      if (option.type === this.IMAGE_TYPE) {
        this.image = option;
      }
      else if (option.type === this.DRAG_TYPE) {
        this.draggables.push(option);
      }
      else if (option.type === this.DROP_TYPE) {
        this.droppables.push(option);
      }
    }
  }

  // handleFileInput(files: FileList) {
  //   //source: https://stackoverflow.com/questions/47936183/angular-file-upload
  //   this.uploadedBaseImage = files.item(0);
  // }

  addDraggableImage() {
    //Date in ms for additional randomness to prevent mistaken overlaps when questions are added/removed
    var tempId = (this.question.options.length + 1).toString() + Date.now() + '-temp';

    this.draggables.push({
      id: tempId,
      question_id: this.question.id,
      type: "DRAGGABLE", 
      count: 1, 
      width: null, 
      height: null, 
      img_url: null,
      new_img: true //only used on front-end for creation
    });

    this.onEdited();
  }

  addDraggableText() {
    //Date in ms for additional randomness to prevent mistaken overlaps when questions are added/removed
    var tempId = (this.question.options.length + 1).toString() + Date.now() + '-temp';

    this.draggables.push({
      id: tempId,
      question_id: this.question.id,
      type: "DRAGGABLE", 
      count: 1, 
      text: '', 
      font_size: 16,
      new_text: true //only used on front-end for creation
    });

    this.onEdited();
  }

  deleteBaseImage() {
    this.image = null;
    this.onEdited();
  }

  deleteDraggable(draggable) {
    for (let [index, option] of this.draggables.entries()) {
      if (draggable.id == option.id) {
        this.draggables.splice(index, 1); 
      }
    }
  }

  isInvalid() {
    return false;
  }

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({question: this.question});
  }

  onImageRatioChange(newValue, valueChanged, image) {
    if (!image.preserveAspectRatio) {
      return false; //if checkbox is turned off
    }

    //dimension ratio originally calculated as width/height
    if (valueChanged === 'width') {
      //where x is the new height: newWidthValue / x = aspectRatio
      //thus: newWidthValue / aspectRatio = x, new height
      image.height = newValue / image.aspectRatio;
    }
    else {
      //where x is the new width: x / newHeightValue = aspectRatio
      //thus: aspectRatio * newHeightValue = x, new width
      image.width = newValue * image.aspectRatio;
    }

    this.onEdited();
  }

  //https://stackoverflow.com/questions/47067249/how-can-i-display-an-image-using-typescript-and-angular-4
  onSelectFile(event, draggable = null) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      // let image = null;
      // if (draggable) {
      //   draggable.image = new Image();
      //   image = draggable.image;
      // }
      // else { //base image
      //   this.image = new Image();
      //   image = this.image;
      // }
      let image = null;
      image = new Image();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => { // called once readAsDataURL is completed
        image.src = event.target.result;
        image.onload = () => {
          

          if (draggable) {
            draggable.img_url = image.src;
            draggable.width = image.width;
            draggable.height = image.height;
            draggable.preserveAspectRatio = true; //to constrain dimension proportions, default is on
            draggable.aspectRatio = image.width / image.height;
          }
          else { //create new base image
            var tempId = 'image-' + Date.now() + '-temp';
            this.image = {
              id: tempId,
              question_id: this.question.id,
              type: "IMAGE", 
              count: 1, 
              width: image.width, 
              height: image.height, 
              img_url: image.src,
              new_img: true //only used on front-end for creation
            };
          }
          this.onEdited();
        }
      }
    }
  }

  onSubComponentEdited($event) {
    this.question = $event.question;
    this.onEdited();
  }

  togglePreserveAspectRatio(image) {
    if (image.preserveAspectRatio) {
      image.preserveAspectRatio = false;
      return;
    }

    image.preserveAspectRatio = true;
    image.aspectRatio = image.width / image.height; //if toggling back on after it was off, reset ratio to new values
  }

  // uploadBaseImage() {
  //   if (this.uploadedBaseImage) {
  //     this.uploadFile(this.uploadedBaseImage);
  //   }
  // }

  // uploadFile(uploadedBaseImage) {
  //   let resp;
  //   let data;
  //   this.uploading = true;

  //   try {
  //     resp = await this.collectionService.importQti(file, this.assessmentGroupId);
  //   }
  //   catch (error) {
  //     this.uploading = false;
  //     this.done = true;
  //     this.error = this.utilitiesService.getError(error);
  //     return;
  //   }

  //   this.uploading = false;
  //   this.done = true;
  //   if (!this.utilitiesService.isSuccessResponse(resp)) {
  //     this.error = this.utilitiesService.getError(resp);
  //     return;
  //   }

  //   data = this.utilitiesService.getResponseData(resp);
  //   const warnings = data.warnings;
  //   if (warnings.critical.length) {
  //     this.criticalNotices = warnings.critical;
  //   }
  //   this.notices = warnings.notices;
  //   this.quizzes = data.quizzes;
  // }

}

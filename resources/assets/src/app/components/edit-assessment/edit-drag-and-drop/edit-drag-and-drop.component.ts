import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { EditAssessmentConfigService } from '../../../services/edit-assessment-config.service';
import { AssessmentEditService } from '../../../services/assessment-edit.service';
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
  CANVAS_PADDING = 100;
  image = null;
  draggables = [];
  droppables = [];
  canvas = null;
  canvasId = null;
  isCanvasMouseDown = false;
  activeDroppableId = null;

  constructor(private editAssessmentConfig: EditAssessmentConfigService, public assessmentEditService: AssessmentEditService, public utilitiesService: UtilitiesService) { 
    this.tinymceOptions = this.editAssessmentConfig.getTinyMceConfig();
  }

  ngOnInit(): void {
    //MM: this was the only way I could find to add custom properties/data to a fabric js object
    //such as a rectangle, so we can assign it a droppable ID and link data when moved, etc.
    //source: https://stackoverflow.com/questions/24851386/fabric-js-add-custom-property-to-itext
    fabric.Object.prototype.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          id: this.id
        });
      };
    })(fabric.Object.prototype.toObject);

    this.canvasId = this.question.id + '-canvas';
    this.initOptions();
  }

  initOptions() {
    let image = null;
    this.question.image = null;
    this.question.draggables = [];
    this.question.droppables = [];

    if (!this.question.options) {
      this.question.options = [];
    }

    for (const option of this.question.options) {
      if (option.type === this.IMAGE_TYPE) {
        option.preserveAspectRatio = true; 
        option.aspectRatio = option.width / option.height;
        this.question.image = option;
        
      }
      else if (option.type === this.DRAG_TYPE) {
        option.preserveAspectRatio = true; 
        option.aspectRatio = option.width / option.height;
        this.question.draggables.push(option);
      }
      else if (option.type === this.DROP_TYPE) {
        this.question.droppables.push(option);
      }
    }

    if (!this.question.image) {
      return;
    }

    image = new Image();
    image.src = this.question.image.img_url;
    image.onload = () => {
      setTimeout(() => { //new digest cycle to render canvas
        this.initCanvas(image);
      }, 0);
    }
  }

  addDraggableImage() {
    //Date in ms for additional randomness to prevent mistaken overlaps when questions are added/removed
    const tempId = (this.question.options.length + 1).toString() + Date.now() + '-temp';

    this.question.draggables.push({
      id: tempId,
      question_id: this.question.id,
      type: "DRAGGABLE", 
      count: 1, 
      width: null, 
      height: null, 
      img_url: null,
      new_img: true, //only used on front-end for creation
      text: null,
      font_size: null,
      left: null,
      top: null,
      answer_id: null
    });

    this.onEdited();
  }

  addDraggableText() {
    //Date in ms for additional randomness to prevent mistaken overlaps when questions are added/removed
    const tempId = (this.question.options.length + 1).toString() + Date.now() + '-temp';

    this.question.draggables.push({
      id: tempId,
      question_id: this.question.id,
      type: "DRAGGABLE", 
      count: 1, 
      text: '', 
      font_size: 16,
      new_text: true, //only used on front-end for creation
      width: null,
      height: null,
      img_url: null,
      left: null,
      top: null,
      answer_id: null
    });

    this.onEdited();
  }

  addDroppable(left, top, rectangle) {
    //Date in ms for additional randomness to prevent mistaken overlaps when questions are added/removed
    const tempId = (this.question.options.length + 1).toString() + Date.now() + '-temp';
    const droppable = {
      id: tempId,
      question_id: this.question.id,
      type: "DROPPABLE", 
      count: 1,
      left,
      top,
      rectangle, //front-end only
      width: null,
      height: null,
      answer_id: null,
      text: null,
      font_size: null,
      img_url: null,
    };
    this.question.droppables.push(droppable);

    return droppable;
  }

  deleteBaseImage() {
    if (this.question.image.id.toString().indexOf('temp') === -1) {
      this.onSavedOptionDeleted.emit({ option: this.question.image });
    }

    this.question.image = null;
    this.onEdited();
  }

  deleteDraggable(draggable) {
    for (let [index, option] of this.question.draggables.entries()) {
      if (draggable.id == option.id) {
        if (draggable.id.toString().indexOf('temp') === -1) {
          this.onSavedOptionDeleted.emit({ option: draggable });
        }
        this.question.draggables.splice(index, 1); 
      }
    }
  }

  deleteDroppable(droppable) {
    for (let [index, option] of this.question.droppables.entries()) {
      if (droppable.id == option.id) {
        if (droppable.id.toString().indexOf('temp') === -1) {
          this.onSavedOptionDeleted.emit({ option: droppable });
        }
        this.canvas.remove(droppable.rectangle);
        this.question.droppables.splice(index, 1); 
      }
    }
  }

  drawDroppable(data) {
    const rectData = {
      left: data.left,
      top: data.top,
      fill: 'rgba(157, 157, 157, 0.3)',
      stroke: 'rgba(130, 130, 130, 0.3)',
      strokeWidth: 3,
      width: data.width ? data.width : 1,
      height: data.height ? data.height: 1
    };

    const rectangle = new fabric.Rect(rectData);
    this.canvas.add(rectangle);
    
    //existing droppable rather than new
    if (data.id) {
      rectangle['id'] = data.id;
    }

    return rectangle;
  }

  findDroppableById(id) {
    for (let droppable of this.question.droppables) {
      if (droppable.id == id) {
        return droppable;
      }
    }

    return null;
  }

  getDroppableIndex(id) {
    for (let [index, option] of this.question.droppables.entries()) {
      if (id == option.id) {
        return index;
      }
    }

    return null;
  }

  initCanvas(image) {
    this.canvas = new fabric.Canvas(this.canvasId, {
      selection: false,
      preserveObjectStacking: true,
    });

    //added extra to width/height of Canvas to allow room for boxes slightly off the edge
    const imgInstance = new fabric.Image(image, { left: this.CANVAS_PADDING / 2, top: this.CANVAS_PADDING / 2, selectable: false });
    this.canvas.add(imgInstance);
    //if loading existing question or user has updated base image, re-draw existing droppables if present
    if (this.question.droppables.length) {
      for (let droppable of this.question.droppables) {
        const rectangle = this.drawDroppable({ left: droppable.left, top: droppable.top, id: droppable.id, width: droppable.width, height: droppable.height });
        droppable.rectangle = rectangle;
      }
      this.canvas.renderAll();
    }

    this.initCanvasEvents();
    this.canvas.renderAll();
  }

  initCanvasEvents() {
    //inspired by: https://jsfiddle.net/wcwabpwc/
    this.canvas.on('mouse:down', (o) => {
      //if mouse is down to resize or move an existing rectangle, don't add a new one;
      //the only way to identify here is based on the custom ID property we are setting
      if (o.target?.id) {
        return;
      }

      const pointer = this.canvas.getPointer(o.e);
      this.isCanvasMouseDown = true;
      const origX = pointer.x;
      const origY = pointer.y;
      const rectangle = this.drawDroppable({ left: origX, top: origY });
      const droppable = this.addDroppable(origX, origY, rectangle);
      //our custom ID attribute can only be added after the fact, and can't use
      //literal notation because it's not an official property of the object in its
      //initial definition and so compilation throws an error if using rectangle.id
      rectangle['id'] = droppable.id; 
    });
  
    this.canvas.on('mouse:move', (o) => {
      let height = 0;
      let width = 0;
      let droppable = null;
      const pointer = this.canvas.getPointer(o.e);

      //we want to know if the rectangle is being moved or resized, which means
      //the mouse is down; ignore plain hover events
      if (!this.isCanvasMouseDown) {
        return;
      }

      if (!this.canvas.getActiveObject()) {
        const items = this.canvas.getObjects();
        const rectangle = items[items.length - 1];
        droppable = this.findDroppableById(rectangle.id);
      }
      else {
        const id = o.target?.id;
        if (id) {
          droppable = this.findDroppableById(id);
        }
      }

      if (!droppable) {
        return;
      }

      width = Math.abs(droppable.left - pointer.x);
      height = Math.abs(droppable.top - pointer.y);
      droppable.width = width;
      droppable.height = height;

      //only set width/height on a newly drawn rectangle; 
      //otherwise width/height gets changed while moving/dragging
      if (!this.canvas.getActiveObject()) {
        droppable.rectangle.set({ width });
        droppable.rectangle.set({ height });
      }
      
      this.canvas.renderAll();
    });
    
    this.canvas.on('mouse:up', (o) => {
      const pointer = this.canvas.getPointer(o.e);
      const left = Math.abs(pointer.x);
      const top = Math.abs(pointer.y);
      let droppable = null;
      this.isCanvasMouseDown = false;

      if (!this.canvas.getActiveObject()) {
        const items = this.canvas.getObjects();
        const rectangle = items[items.length - 1];
        droppable = this.findDroppableById(rectangle.id);
      }
      else {
        const id = o.target?.id;
        if (id) {
          droppable = this.findDroppableById(id);
        }
      }

      if (!droppable) {
        return;
      }

      //if user clicked to remove focus, etc., and didn't mean to create a droppable,
      //or if somehow lack of width/height makes it impossible to use, then remove
      if (!droppable.width || !droppable.height) {
        this.canvas.remove(droppable.rectangle);
        this.question.droppables.splice(this.question.droppables.length - 1, 1);
      }

      //change location, width, and height if needed after moving/resizing
      droppable.rectangle.setCoords();
      droppable.top = Math.round(droppable.rectangle.top);
      droppable.left = Math.round(droppable.rectangle.left);
      droppable.width = Math.round(droppable.rectangle.getScaledWidth());
      droppable.height = Math.round(droppable.rectangle.getScaledHeight());

      //highlight droppable in table
      this.activeDroppableId = droppable.id;
    });

    this.canvas.on('mouse:over', (o) => {
      if (o.target?.id) {
        this.activeDroppableId = o.target.id;
      }
      else {
        //if rectangle has been clicked on and is active, retain hover state
        if (!this.canvas.getActiveObject()) {
          this.activeDroppableId = null;
        }
      }
    });

    this.canvas.on('mouse:out', (o) => {
      //if rectangle has been clicked on and is active, retain hover state
      if (!this.canvas.getActiveObject()) {
        this.activeDroppableId = null;
      }
    });
  }

  isInvalid() {
    return false;
  }

  onDroppableInputChange(newValue, attr, droppable) {
    if (!newValue) {
      return;
    }

    const numericValue = +(newValue);

    if (attr === 'top') {
      droppable.rectangle.top = numericValue;
    }
    else if (attr === 'left') {
      droppable.rectangle.left = numericValue;
    }
    else if (attr === 'height') {
      droppable.rectangle.scaleToHeight(numericValue);
    }
    else if (attr === 'width') {
      droppable.rectangle.scaleToWidth(numericValue);
    }

    droppable.rectangle.setCoords();
    this.canvas.renderAll();
  }

  onEdited() {
    this.question.validationError = this.isInvalid();
    this.onQuestionEdited.emit({question: this.question});
  }

  onImageRatioChange(newValue, valueChanged, image) {
    if (!newValue) {
      return false;
    }

    //have to preserve aspect ratio for base image to resize properly in fabric.js Canvas
    if (image.type == this.IMAGE_TYPE) {
      image.preserveAspectRatio = true;
    }

    if (image.preserveAspectRatio) {
      //dimension ratio originally calculated as width/height
      if (valueChanged === 'width') {
        //where x is the new height: newWidthValue / x = aspectRatio
        //thus: newWidthValue / aspectRatio = x, new height
        image.height = Math.floor(newValue / image.aspectRatio);
      }
      else {
        //where x is the new width: x / newHeightValue = aspectRatio
        //thus: aspectRatio * newHeightValue = x, new width
        image.width = Math.floor(newValue * image.aspectRatio);
      }
    }
    else {
      //although this technically gets changed by angular later, we have to define it
      //here so we can redraw the Canvas appropriately given the new values
      if (valueChanged === 'width') {
        image.width = newValue;
      }
      else {
        image.height = newValue;
      }
    }

    //re-render Canvas if base image
    if (image.type == this.IMAGE_TYPE) {
      setTimeout(() => {
        let canvasWidth = image.width + this.CANVAS_PADDING;
        let canvasHeight = image.height + this.CANVAS_PADDING;
        this.canvas.setWidth(canvasWidth);
        this.canvas.setHeight(canvasHeight);
        const canvasImages = this.canvas.getObjects('image');
        const canvasImage = canvasImages[0];
        canvasImage.scaleToWidth(this.canvas.getWidth() - this.CANVAS_PADDING, true);
        canvasImage.scaleToHeight(this.canvas.getHeight() - this.CANVAS_PADDING, true);
        this.canvas.renderAll();
      }, 0)
    }

    this.onEdited();
  }

  //https://stackoverflow.com/questions/47067249/how-can-i-display-an-image-using-typescript-and-angular-4
  async onSelectFile(event, draggable = null) {
    if (!event.target.files && !event.target.files[0]) {
      return;
    }

    //const reader = new FileReader();
    const file = event.target.files[0];
    let image = new Image();
    let data;

    try {
      //note: slightly different format here than usual requests where we need utilities service
      //to read the data; we are sending a plain response back because it's the same endpoint that
      //tinymce uses for image uploads in a question and that requires plain data format
      data = await this.assessmentEditService.uploadImage(file);
    }
    catch(error) {
      this.utilitiesService.showError(error);
      return;
    }
    
    image.src = data.location;
    image.onload = () => {
      if (draggable) {
        draggable.img_url = image.src;
        draggable.width = image.width;
        draggable.height = image.height;
        draggable.preserveAspectRatio = true; //front-end only, to constrain dimension proportions, default is on
        draggable.aspectRatio = image.width / image.height; //front-end only
        draggable.imgFile = file; //to upload image to back-end
      }
      else { //create new base image
        var tempId = 'image-' + Date.now() + '-temp';
        this.question.image = {
          id: tempId,
          question_id: this.question.id,
          type: "IMAGE", 
          count: 1, 
          width: image.width, 
          height: image.height, 
          img_url: image.src,
          new_img: true, //only used on front-end for creation
          preserveAspectRatio: true, //front-end only
          aspectRatio: image.width / image.height, //front-end only
          imgFile: file, //to upload image to back-end
          left: null,
          top: null,
          text: null,
          font_size: null,
          answer_id: null
        };

        setTimeout(() => { //new digest cycle to render canvas
          this.initCanvas(image);
        }, 0);
      }
      this.onEdited();
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
}

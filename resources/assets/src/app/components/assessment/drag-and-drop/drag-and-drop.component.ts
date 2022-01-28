import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import {transferArrayItem} from '@angular/cdk/drag-drop';

@Component({
  selector: 'qc-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  @Input() currentQuestion;
  @Input() incorrectOptions;
  @Output() onAnswerSelection = new EventEmitter();

  DRAG_TYPE = 'DRAGGABLE';
  DROP_TYPE = 'DROPPABLE';
  IMAGE_TYPE = 'IMAGE'; //the base image
  OPTION_LIST_DROP_LIST_ID = 'OPTION_LIST'; //to identify the option container when a placed option is dragged back
  image = null;
  draggables = [];
  droppables = [];
  dragListHighlighted = false;

  constructor(public utilitiesService: UtilitiesService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changesObj)  {
    if (changesObj.currentQuestion) {
      this.initOptions();
      this.utilitiesService.formatMath();
      this.utilitiesService.setLtiHeight();
    }
  }

  initOptions() {
    //reset if a previous drag and drop question
    this.image = null;
    this.draggables = [];
    this.droppables = [];

    //sort into base image, draggables, and droppables, and add object attributes that we use
    //on the front-end for interaction but that aren't in the database model
    for (let option of this.currentQuestion.options) {
      if (option.type === this.IMAGE_TYPE) {
        this.image = option;
      }

      if (option.type === this.DROP_TYPE) {
        option.disabled = false;
        option.entered = false;
        option[this.DRAG_TYPE] = [];
        this.droppables.push(option);
      }

      if (option.type === this.DRAG_TYPE) {
        option.disabled = false;
        option[this.DROP_TYPE] = null;
        this.draggables.push(option);
      }
    }

    //duplicate draggables with multiple counts
    for (let i = 0; i < this.draggables.length; i++) {
      const draggable = this.draggables[i];
      if (draggable.count > 1) {
        for (let j = 0; j < draggable.count - 1; j++) {
          const clone = JSON.parse(JSON.stringify(draggable));
          this.draggables.splice(i, 0, clone);
        }
        i += (draggable.count - 1); //increment counter so we don't loop over those we just added
      }
    }
  }

  isDroppableIncorrect(droppable) {
    if (!this.incorrectOptions) {
      return false;
    }

    for (let incorrectOption of this.incorrectOptions) {
      if (incorrectOption.id == droppable.id) {
        return true;
      }
    }

    return false;
  }

  isDraggedImg(droppable) {
    if (!droppable[this.DRAG_TYPE].length) {
      return false;
    }

    if (!droppable[this.DRAG_TYPE][0].img_url) {
      return false;
    }

    return true;
  }

  isDraggedText(droppable) {
    if (!droppable[this.DRAG_TYPE].length) {
      return false;
    }

    if (!droppable[this.DRAG_TYPE][0].text) {
      return false;
    }

    return true;
  }

  getDroppableLeftPosition(droppable) {
    //for droppable zone, position to make it a bounding box, but for a draggable that's been placed, snap to center
    if (droppable.type === this.DROP_TYPE) {
      return droppable.left - (droppable.width / 2); 
    }
    
    //favoring CSS centering over this for now for dropped options, but keeping in case there are issues
    //return droppable[this.DROP_TYPE].left - (droppable.width / 2);
  }

  getDroppableTopPosition(droppable) {
    //for droppable zone, position to make it a bounding box, but for a draggable that's been placed, snap to center
    if (droppable.type === this.DROP_TYPE) {
      return droppable.top - (droppable.height / 2);
    }

    //favoring CSS centering over this for now for dropped options, but keeping in case there are issues
    //return droppable[this.DROP_TYPE].top - (droppable.height / 2);
  }

  dropOutsideOfAnswer(event) {
    if (!event.isPointerOverContainer) {
      return false;
    }

    //do nothing if they dragged and dropped onto the same spot
    if (event.previousContainer === event.container) {
      this.dragListHighlighted = false;
      return false;
    }

    //transfer from droppable area back to the option list
    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);

    //remove any previously linked data and styling
    const droppedOption = event.container.data[event.currentIndex];
    this.resetAnswerData(droppedOption);
    this.dragListHighlighted = false;

    //re-sort to make sure options are grouped together by duplicates and in original positions
    this.sortOptions();
  }

  //as draggable items are dragged onto the droppable zones, they technically get
  //converted into droppables; make sure the original list remains intact
  getDroppables() {
    return this.droppables.filter(droppable => {
      return droppable.type === this.DROP_TYPE;
    })
  }

  sortOptions() {
    this.draggables.sort((a, b) => {
      if (a.id < b.id) {
        return -1
      }

      if (a.id > b.id) {
        return 1;
      }

      return 0;
    });
  }

  dropOntoAnswer(event) {
    if (!event.isPointerOverContainer) {
      return false;
    }

    //do nothing if they dragged and dropped onto the same spot
    if (event.previousContainer === event.container) {
      return false;
    }

    const droppableId = event.container.id;
    const droppableArea = this.getDroppableById(droppableId);

    transferArrayItem(event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex);

    const droppedOption = event.container.data[event.currentIndex];

    //reset linked data if it was used as an answer previously and dropped somewhere else
    this.resetAnswerData(droppedOption);

    //if moving onto a spot where an option has already been placed 
    if (droppableArea[this.DRAG_TYPE].length > 1) {
      let transferOptionIndex = null;
      let transferDropOption = null;

      for (let [index, option] of droppableArea[this.DRAG_TYPE].entries()) {
        //grab the option that was originally in this position to swap to the other spot;
        //had to add a bit of logic here for the edge case where maybe it's the same option ID
        //but the count is > 1 so they are separate on the page; generally imagine they'll be different!
        if (option.id != droppedOption.id || (option.id === droppedOption.id && option.count > 1)) {
          transferOptionIndex = index;
          transferDropOption = option;
        }
      }

      const previousDroppableId = event.previousContainer.id;
      const previousDroppableArea = this.getDroppableById(previousDroppableId);
      //if swapping between two droppable zones
      if (previousDroppableArea) {
        previousDroppableArea[this.DRAG_TYPE].push(transferDropOption);
        previousDroppableArea.disabled = true;
      }
      //if swapping betwen a droppable zone and the original option list
      else {
        transferArrayItem(event.container.data,
          event.previousContainer.data,
          transferOptionIndex,
          event.previousIndex);
        this.sortOptions();
      }
      
      transferDropOption[this.DROP_TYPE] = previousDroppableArea;
    }

    //prevent user from dropping multiple options onto the same area
    droppableArea.disabled = true;

    //link both options together and make data available for position calculations to snap to place, etc.
    droppableArea[this.DRAG_TYPE].push(droppedOption);
    droppedOption[this.DROP_TYPE] = droppableArea;

    //remove drag-enter styling
    droppableArea.entered = false;

    //emit data to parent
    this.onAnswerSelected();
  }

  getDraggableById(id) {
    for (const draggable of this.draggables) {
      if (draggable.id == id) {
        return draggable;
      }
    }

    return null;
  }

  getDroppableById(id) {
    for (const droppable of this.droppables) {
      if (droppable.id == id) {
        return droppable;
      }
    }

    return null;
  }

  resetAnswerData(droppedOption) {
    //if user switched answers, remove linked data from the previous drop area;
    //on the user's initial drop from the option list, this data will not be present
    const previousDroppableArea = droppedOption[this.DROP_TYPE];
    if (previousDroppableArea) {
      const droppableArea = this.getDroppableById(previousDroppableArea.id);
      droppableArea.disabled = false;
      droppableArea[this.DRAG_TYPE] = [];
    }
    
    droppedOption.disabled = false;
    droppedOption[this.DROP_TYPE] = null;
  }

  //if a user has already dragged an answer and wants to drag it back to the
  //option list, don't highlight the area until it has been entered by the
  //draggable; unlike moving from the option list to the droppable zones,
  //we don't want to style the area and hint the user as soon as they start
  //dragging because they are more likely to drag to a different droppable,
  //but we do want to hint that moving it back to the option list is a possibility
  optionListDragEntered(event) {
    this.dragListHighlighted = true;
  }

  optionListDragExited(event) {
    this.dragListHighlighted = false;
  }

  droppableEntered(event) {
    const droppableId = event.container.id;
    const droppableArea = this.getDroppableById(droppableId);
    if (droppableArea.disabled) {
      return false;
    }

    droppableArea.entered = true;
  }

  droppableExited(event) {
    const droppableId = event.container.id;
    const droppableArea = this.getDroppableById(droppableId);
    if (droppableArea.disabled) {
      return false;
    }

    droppableArea.entered = false;
  }

  getCurrentAnswers() {
    const answers = [];

    for (let droppable of this.droppables) {
      if (droppable[this.DRAG_TYPE].length) {
        const answer = {'droppable_id': droppable.id, 'draggable_id': droppable[this.DRAG_TYPE][0].id};
        answers.push(answer);
      }
    }

    return answers;
  }

  onAnswerSelected() {
    let studentAnswer = {'drag_and_drop_answers': []},
      answerComplete = false;

    studentAnswer.drag_and_drop_answers = this.getCurrentAnswers();

    if (studentAnswer.drag_and_drop_answers.length === this.droppables.length) {
      answerComplete = true;
    }

    this.onAnswerSelection.emit({
      answerComplete: answerComplete,
      studentAnswer: studentAnswer
    });
  }

  isLastDuplicateDraggable(draggable, i) {
    if (draggable.count === 1) {
      return false;
    }

    if (i === this.draggables.length - 1) {
      return false;
    }

    if (draggable.id === this.draggables[i + 1].id) {
      return false;
    }

    return true;
  }

}

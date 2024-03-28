import { Component, OnInit, OnChanges, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { UtilitiesService } from '../../../services/utilities.service';
import {transferArrayItem} from '@angular/cdk/drag-drop';
import { Option, OptionTypeEnum, Question } from '../assessment.component';
import { LiveAnnouncer } from "@angular/cdk/a11y";


import * as cloneDeep from 'lodash/cloneDeep';

export enum KEY_CODE {
  RIGHT_ARROW = 'ArrowRight',
  LEFT_ARROW = 'ArrowLeft',
  UP_ARROW = 'ArrowUp',
  DOWN_ARROW = 'ArrowDown',
  SPACE = 'Space',
  ESCAPE = 'Escape',
  TAB = 'Tab',
  DELETE = 'Delete',
  BACKSPACE = 'Backspace',
  KEY_S = 'KeyS',
  KEY_R = 'KeyR',
  KEY_I = 'KeyI',
  ENTER = 'Enter'
}

export interface DroppableTracker {
  selectedDraggable: Option;
  indexOfSelectedDraggable: number;
  indexOfSelectedDroppable: number;
}


// to identify the option container when a placed option is dragged back
const OPTION_LIST_DROP_LIST_ID = 'OPTION_LIST'; // draggable container
const OPTION_LIST_DROP_HEADER_ID = 'OPTION_LIST_HEADER'; // draggable container header

const DRAGGABLE_ID = 'DRAGGABLE';
const DROPPABLE_CONTAINER_ID = 'DROPPABLE_CONTAINER';

const DROPPABLE_CONTAINER_PADDING = 100;
const DRAGGABLE_MARGIN_RIGHT = 20;
const DRAGGABLE_MARGIN_BOTTOM = 20;

/*
  things left to do:
  1. live announcer 👍
  2. space bar to get blue outline 👍
  3. bug with choosing and replacing wrong one
*/


@Component({
  selector: 'qc-drag-and-drop',
  templateUrl: './drag-and-drop.component.html',
  styleUrls: ['./drag-and-drop.component.scss']
})
export class DragAndDropComponent implements OnInit {
  @Input() currentQuestion: Question;
  @Input() incorrectOptions;
  @Output() onAnswerSelection = new EventEmitter();


  // IMAGE_TYPE = 'IMAGE'; //the base image
  optionListId = OPTION_LIST_DROP_LIST_ID;
  optionListHeaderId = OPTION_LIST_DROP_HEADER_ID;
  draggableId = DRAGGABLE_ID;
  droppableContainerId = DROPPABLE_CONTAINER_ID;
  droppableContainerPadding = DROPPABLE_CONTAINER_PADDING;
  draggableMarginRight = DRAGGABLE_MARGIN_RIGHT;
  optionTypeEnum = OptionTypeEnum;
  
  image: Option = null;
  draggables = new Array<Option>;
  droppables = new Array<Option>;
  dragListHighlighted: boolean = false;

  keyDroppableProperties: DroppableTracker;

  /* 
  * This is a map of which draggables are on which droppables

  * key: index of Droppable
  * value: index of draggable
  * droppable index -> draggable index
  * 
  * if the value (draggable index) is -1, then the droppable is empty
  */ 
  droppableDraggableIndexMap = new Map<number, number>();

  @HostListener('window:keydown', ['$event'])
  keyEventDown(event: KeyboardEvent) {
    if (event.code === KEY_CODE.RIGHT_ARROW || event.code === KEY_CODE.LEFT_ARROW || event.code === KEY_CODE.UP_ARROW
      || event.code === KEY_CODE.DOWN_ARROW || event.code === KEY_CODE.SPACE || event.code === KEY_CODE.TAB || event.code === KEY_CODE.ESCAPE) {
        event.preventDefault();
    }
  }

  @HostListener('window:keyup', ['$event'])
  keyEventUp(event: KeyboardEvent) {
    switch (event.code) {
      // Note: Up = right and down = left arrow keys
      case KEY_CODE.UP_ARROW:
      case KEY_CODE.RIGHT_ARROW:
        this.arrowClicked('up'); 

        break;

      case KEY_CODE.LEFT_ARROW:
      case KEY_CODE.DOWN_ARROW:
        this.arrowClicked('down');

        break;

      case KEY_CODE.SPACE:
        this.spaceClicked();
        this.onAnswerSelected(); //emit data to parent

        break;

      case KEY_CODE.TAB:
        this.tabClicked();

        break;
  
      case KEY_CODE.BACKSPACE:
      case KEY_CODE.DELETE:
      case KEY_CODE.ESCAPE:
        this.deleteClicked();
        this.onAnswerSelected(); //emit data to parent

        break;

      case KEY_CODE.KEY_I:

       break;

      default:
        // Do Nothing
        break;
    }
  }


  constructor(
    public utilitiesService: UtilitiesService,
    private liveAnnouncer: LiveAnnouncer
    ) { }

  ngOnInit(): void {
    this.keyDroppableProperties = {
      selectedDraggable: null,
      indexOfSelectedDraggable: null,
      indexOfSelectedDroppable: 0
    }
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
    this.keyDroppableProperties = {
      selectedDraggable: null,
      indexOfSelectedDraggable: null,
      indexOfSelectedDroppable: 0
    }
    this.image = null;
    this.draggables = [];
    this.droppables = [];

    //sort into base image, draggables, and droppables, and add object attributes that we use
    //on the front-end for interaction but that aren't in the database model
    for (let option of this.currentQuestion.options) {
      if (option.type === OptionTypeEnum.Image) {
        this.image = option;
      }

      if (option.type === OptionTypeEnum.Droppable) {
        option.disabled = false;
        option.entered = false;
        option[OptionTypeEnum.Draggable] = [];
        option._unique_id = this.utilitiesService.generateUniqueId();
        this.droppables.push(option);
      }

      if (option.type === OptionTypeEnum.Draggable) {
        option.disabled = false;
        option[OptionTypeEnum.Droppable] = null;
        option._unique_id = this.utilitiesService.generateUniqueId();
        this.draggables.push(option);
      }
    }

    //duplicate draggables with multiple counts
    for (let i = 0; i < this.draggables.length; i++) {
      const draggable = this.draggables[i];
      if (draggable.count > 1) {
        for (let j = 0; j < draggable.count - 1; j++) {
          const clone = JSON.parse(JSON.stringify(draggable));
          clone._unique_id = this.utilitiesService.generateUniqueId();
          this.draggables.splice(i, 0, clone);
        }
        i += (draggable.count - 1); //increment counter so we don't loop over those we just added
      }
    }
    this.droppables.forEach((droppable, i) => {
      this.droppableDraggableIndexMap.set(i, -1);
    })
    
  }

  /*ƒƒ
  * Positions the Droppable to the selected ƒ∂ƒdraggable
  * The positioning is dynamically calculated and applied as a style
  * Changes in the HTML template will cause issues here
  */ 
  positionDroppable(): void {
      const droppableTop = this.droppables[this.keyDroppableProperties.indexOfSelectedDroppable].top;
      const droppableLeft = this.droppables[this.keyDroppableProperties.indexOfSelectedDroppable].left;
  
      // const droppableHeight = this.droppables[this.keyDroppableProperties.indexOfSelectedDroppable].height;
      // const droppableWidth = this.droppables[this.keyDroppableProperties.indexOfSelectedDroppable].width;
  
      const draggableElement = document.getElementById(this.getDraggableId(this.keyDroppableProperties.selectedDraggable._unique_id));
      const qcDroppableContainerElementHeight = document.getElementById(DROPPABLE_CONTAINER_ID).offsetHeight;
      const qcDraggableContainerElementHeight = document.getElementById(OPTION_LIST_DROP_LIST_ID).offsetHeight + document.getElementById(OPTION_LIST_DROP_HEADER_ID).offsetHeight;
  
      // For Horizontal draggables
      let widthToMoveLeft = 0;
      this.draggables.forEach((draggable, index) => {
        if (this.keyDroppableProperties.indexOfSelectedDraggable > index) {
          const draggableElement = document.getElementById(`${DRAGGABLE_ID}-${draggable._unique_id}`);
          widthToMoveLeft += draggableElement.clientWidth + DRAGGABLE_MARGIN_RIGHT;
        }
      });
      /*
      console.log('qcDroppableContainerElementHeight - droppableTop: ', qcDroppableContainerElementHeight - droppableTop);
      console.log('qcDraggableContainerElementHeight/2: ', qcDraggableContainerElementHeight/2);
      console.log('draggableElement.offsetHeight: ', draggableElement.offsetHeight);
      */ 

      // For Horizontal draggables
      // const draggableTop = qcDroppableContainerElementHeight - droppableTop + qcDraggableContainerElementHeight/2 - draggableElement.offsetHeight/2 - 10;
      // const draggableLeft = droppableLeft - widthToMoveLeft;

      // For Vertical draggables
      let heightToMoveTop = 0;
      this.draggables.forEach((draggable, index) => {
        if (this.keyDroppableProperties.indexOfSelectedDraggable > index) {
          const draggableElement = document.getElementById(`${DRAGGABLE_ID}-${draggable._unique_id}`);
          heightToMoveTop += draggableElement.clientHeight + DRAGGABLE_MARGIN_BOTTOM;
        }
      });

      // For Vertical Draggables
      const draggableTop = qcDroppableContainerElementHeight - droppableTop + heightToMoveTop + 36 + 55;
      const draggableLeft = droppableLeft - 10;

      draggableElement.style.top = `-${draggableTop}px`;
      draggableElement.style.left = `${draggableLeft}px`;
      draggableElement.style.textAlign = 'left';
  }

  /* 
  * Tab is Clicked
  * When tab is clicked we want to switch the selecting "cursor" to the next draggable
  * If we are at the last draggable, we go back to the first one
  */ 
  tabClicked(): void {
    // @TODO - look at this code

    // if (this.droppableDraggableIndexMap.get(this.keyDroppableProperties.indexOfSelectedDroppable) === -1) {
    //   this.returnDraggableToOriginialPositioning(this.keyDroppableProperties.indexOfSelectedDraggable);
    // }

    this.keyDroppableProperties.selectedDraggable = null;
    if (this.draggables.length - 1 <= this.keyDroppableProperties.indexOfSelectedDraggable) {
      this.keyDroppableProperties.indexOfSelectedDraggable = 0;
    } else {
      this.keyDroppableProperties.indexOfSelectedDraggable += 1;
    }


    let textToAnnounce = `${this.optionAnnouncementName(this.draggables[this.keyDroppableProperties.indexOfSelectedDraggable])} is selected.
      Press space to grab.`;
    this.liveAnnouncer.announce(textToAnnounce);

    // Update the indexOfSelectedDroppable if the draggable is in a droppable
    this.droppableDraggableIndexMap.forEach((value, key) => {
      // key: index of Droppable
      // value: index of draggable
      if (value === this.keyDroppableProperties.indexOfSelectedDraggable) {
        this.keyDroppableProperties.indexOfSelectedDroppable = key;
      }
    });
  }

  /* 
  * Delete is Clicked
  * When delete/esc/backspace is clicked we want to return the selected droppable bacak to the droppable bank
  * We also update the droppableDraggableIndexMap
  */ 
  deleteClicked(): void {
    if (this.keyDroppableProperties.selectedDraggable !== null) {
      const indexOfDraggableOnSelectedDraggable = this.droppableDraggableIndexMap.get(this.keyDroppableProperties.indexOfSelectedDroppable);
      this.returnDraggableToOriginialPositioning(this.draggables[this.keyDroppableProperties.indexOfSelectedDraggable]._unique_id, indexOfDraggableOnSelectedDraggable);
      this.droppableDraggableIndexMap.set(this.keyDroppableProperties.indexOfSelectedDroppable, -1);
    }
  }

  optionAnnouncementName(option: Option): string {
    if (option) {
      return option && option.text !== undefined && option.text !== null ? option.text : `${option.type} number ${option.id + 1}`
    } else {
      return '';
    }
  }

  /* 
  * Space is Clicked
  * When space is clicked we want to either:
  *   1. Select a draggable if none is selected (see first if conditional)
  *   2. Position the draggable on a droppable (i.e. do a drag from a draggable to a droppable)
  * We also update the droppableDraggableIndexMap
  */ 
  spaceClicked(): void {
    if (this.keyDroppableProperties.indexOfSelectedDraggable === null) {
      this.keyDroppableProperties.indexOfSelectedDraggable = 0;
    }
    if (this.keyDroppableProperties.selectedDraggable === null) {
      this.keyDroppableProperties.selectedDraggable = this.draggables[this.keyDroppableProperties.indexOfSelectedDraggable];
      let textToAnnounce = 
      `${this.optionAnnouncementName(this.draggables[this.keyDroppableProperties.indexOfSelectedDraggable])} is grabbed. Press the up and down arrows to hear drop zones, spacebar to drop, and escape to return this answer to the answer bank.`;
      this.liveAnnouncer.announce(textToAnnounce);
    } else {
      const indexOfDraggableOnSelectedDraggable = this.droppableDraggableIndexMap.get(this.keyDroppableProperties.indexOfSelectedDroppable);
      // console.log(cloneDeep(this.droppableDraggableIndexMap), indexOfDraggableOnSelectedDraggable);
      if (indexOfDraggableOnSelectedDraggable >= 0) {
        this.returnDraggableToOriginialPositioning(this.draggables[indexOfDraggableOnSelectedDraggable]._unique_id, indexOfDraggableOnSelectedDraggable);
      }
      this.droppableDraggableIndexMap.set(this.keyDroppableProperties.indexOfSelectedDroppable, this.keyDroppableProperties.indexOfSelectedDraggable);
      let textToAnnounce = 
       `${this.optionAnnouncementName(this.draggables[this.keyDroppableProperties.indexOfSelectedDraggable])} is now assigned as an answer to 
        ${this.optionAnnouncementName(this.droppables[this.keyDroppableProperties.indexOfSelectedDroppable])}`;
      this.liveAnnouncer.announce(textToAnnounce);
      this.keyDroppableProperties.selectedDraggable = null;
      this.setDroppablesEnteredProperty();
    }
  }

  /* 
  * Up/down arrows are Clicked
  * When up/down is clicked we want to move the selected draggable to the next or previous droppable respectively.
  */ 
  arrowClicked(arrow: 'up' | 'down'): void {
    if (this.keyDroppableProperties.selectedDraggable !== null) {
      if (this.keyDroppableProperties.indexOfSelectedDroppable === null) {
        this.keyDroppableProperties.indexOfSelectedDroppable = 0;
      } else {
        if (arrow === 'up') {
          if (this.droppables.length - 1 <= this.keyDroppableProperties.indexOfSelectedDroppable) {
            this.keyDroppableProperties.indexOfSelectedDroppable = 0;
          } else {
            this.keyDroppableProperties.indexOfSelectedDroppable += 1;          
          }
        } else if (arrow === 'down') {
          if (this.keyDroppableProperties.indexOfSelectedDroppable <= 0) {
            this.keyDroppableProperties.indexOfSelectedDroppable = this.droppables.length - 1;
          } else {
            this.keyDroppableProperties.indexOfSelectedDroppable -= 1;          
          }
        }
      }
      this.positionDroppable();
      let textToAnnounce = 
        `Press Space to Assign ${this.optionAnnouncementName(this.draggables[this.keyDroppableProperties.indexOfSelectedDraggable])} to 
        ${this.optionAnnouncementName(this.droppables[this.keyDroppableProperties.indexOfSelectedDroppable])}. Press the up and down arrows to hear more drop zones, and escape to cancel.`;
      this.liveAnnouncer.announce(textToAnnounce);
    }
  }

  /* 
  * Utility function to return (read: position) the draggable to bank
  */ 
  returnDraggableToOriginialPositioning(draggableId: string, indexOfDraggableOnSelectedDraggable: number): void {
    if (draggableId) {
      const draggableElement = document.getElementById(this.getDraggableId(draggableId));
      if (draggableElement) {
        draggableElement.style.top = `0px`;
        draggableElement.style.left = `0px`
        draggableElement.style.textAlign = 'center';
      }
      let textToAnnounce = `${this.optionAnnouncementName(this.draggables[indexOfDraggableOnSelectedDraggable])} is returned to answer bank.`
      this.liveAnnouncer.announce(textToAnnounce);
    }
;
  }

  /* 
  * Gets the associted unique ID for a draggable
  */ 
  getDraggableId(idOfSelectedDraggable: string):string {
    return `${DRAGGABLE_ID}-${idOfSelectedDraggable}`;
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
    if (!droppable[OptionTypeEnum.Draggable].length) {
      return false;
    }

    if (!droppable[OptionTypeEnum.Draggable][0].img_url) {
      return false;
    }

    return true;
  }

  isDraggedText(droppable) {
    if (!droppable[OptionTypeEnum.Draggable].length) {
      return false;
    }

    if (!droppable[OptionTypeEnum.Draggable][0].text) {
      return false;
    }

    return true;
  }

  getDroppableLeftPosition(droppable) {
    //for droppable zone, position to make it a bounding box, but for a draggable that's been placed, snap to center
    if (droppable.type === OptionTypeEnum.Droppable) {
      return droppable.left - (droppable.width / 2); 
    }
    
    //favoring CSS centering over this for now for dropped options, but keeping in case there are issues
    //return droppable[OptionTypeEnum.Droppable].left - (droppable.width / 2);
  }

  getDroppableTopPosition(droppable) {
    //for droppable zone, position to make it a bounding box, but for a draggable that's been placed, snap to center
    if (droppable.type === OptionTypeEnum.Droppable) {
      return droppable.top - (droppable.height / 2);
    }

    //favoring CSS centering over this for now for dropped options, but keeping in case there are issues
    //return droppable[OptionTypeEnum.Droppable].top - (droppable.height / 2);
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
      return droppable.type === OptionTypeEnum.Droppable;
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

    transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

    const droppedOption = event.container.data[event.currentIndex];

    //reset linked data if it was used as an answer previously and dropped somewhere else
    this.resetAnswerData(droppedOption);

    //if moving onto a spot where an option has already been placed 
    if (droppableArea[OptionTypeEnum.Draggable].length > 1) {
      let transferOptionIndex = null;
      let transferDropOption = null;

      for (let [index, option] of droppableArea[OptionTypeEnum.Draggable].entries()) {
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
        previousDroppableArea[OptionTypeEnum.Draggable].push(transferDropOption);
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
      
      transferDropOption[OptionTypeEnum.Droppable] = previousDroppableArea;
    }

    //prevent user from dropping multiple options onto the same area
    droppableArea.disabled = true;

    //link both options together and make data available for position calculations to snap to place, etc.
    droppableArea[OptionTypeEnum.Draggable].push(droppedOption);
    droppedOption[OptionTypeEnum.Droppable] = droppableArea;

    //remove drag-enter styling
    droppableArea.entered = false;

    //emit data to parent
    this.onAnswerSelected();
  }

  getDraggableById(id: string) {
    for (const draggable of this.draggables) {
      if (draggable._unique_id == id) {
        return draggable;
      }
    }

    return null;
  }

  getDroppableById(id: string) {
    for (const droppable of this.droppables) {
      if (droppable._unique_id === id) {
        return droppable;
      }
    }

    return null;
  }

  resetAnswerData(droppedOption) {
    //if user switched answers, remove linked data from the previous drop area;
    //on the user's initial drop from the option list, this data will not be present
    const previousDroppableArea = droppedOption[OptionTypeEnum.Droppable];
    if (previousDroppableArea) {
      const droppableArea = this.getDroppableById(previousDroppableArea._unique_id);
      droppableArea.disabled = false;
      droppableArea[OptionTypeEnum.Draggable] = [];
    }
    
    droppedOption.disabled = false;
    droppedOption[OptionTypeEnum.Droppable] = null;
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

  setDroppablesEnteredProperty(): void {
    // key -> index of droppable
    // value -> index of draggable
    this.droppableDraggableIndexMap.forEach((value, key) => {
      if (value !== -1) {
        this.droppables[key].entered = true;
      } else {
        this.droppables[key].entered = false;
      }
    });
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
      if (droppable[OptionTypeEnum.Draggable].length) {
        const answer = {'droppable_id': droppable.id, 'draggable_id': droppable[OptionTypeEnum.Draggable][0].id};
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

    /***** for keyboard accessibility only ****/ 
    let keyboardAccessiblityAnswerComplete = null;
    this.droppableDraggableIndexMap.forEach((value, key) => {
      if (value === -1) {
        keyboardAccessiblityAnswerComplete = false;
      }
    });

    if (keyboardAccessiblityAnswerComplete === null) { // this will be false if drag & drop is used and not accessiblity control
      answerComplete = true;
      this.droppableDraggableIndexMap.forEach((value, key) => {
        if (value !== -1) { // this should always be true
          const answer = 
          {
            'droppable_id': this.droppables[key].id, 
            'draggable_id': this.draggables[value].id
          }
          studentAnswer.drag_and_drop_answers.push(answer)
        }
      });
    }
    /******************************************/ 


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

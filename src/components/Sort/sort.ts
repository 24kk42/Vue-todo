/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue } from "vue-property-decorator";
import Table from "../Table/table.vue";

@Component
export default class Sort extends Vue {
  protected stateSpecifier: Array<string> = [];
  protected prioritySpecifier: Array<string> = [];
  protected table = new Table();
  protected bool = false ;


  protected priorityRadioButtonHandler(e: Event, e2: KeyboardEvent): void {
    const inputElem = <HTMLInputElement>e.target;

    if (e2.ctrlKey) {
      inputElem.checked = false;
    }
    const currentChecked = inputElem.checked;
    if (currentChecked === true) {
      if (!this.prioritySpecifier.includes(inputElem.value)) {
        this.prioritySpecifier.push(inputElem.value);
      }
    } else {
      if (this.prioritySpecifier.includes(inputElem.value)) {
        this.prioritySpecifier.splice(
          this.prioritySpecifier.indexOf(inputElem.value),
          1
        );
      }
    }
  }

  protected stateRadioButtonHandler(e: Event, e2: KeyboardEvent): void {
    const inputElem = <HTMLInputElement>e.target;

    if (e2.ctrlKey) {
      inputElem.checked = false;
    }
    const currentChecked = inputElem.checked;
    if (currentChecked === true) {
      if (!this.stateSpecifier.includes(inputElem.value)) {
        this.stateSpecifier = [];
        this.stateSpecifier.push(inputElem.value);
      }
    } else {
      if (this.stateSpecifier.includes(inputElem.value)) {
        this.stateSpecifier.splice(
          this.stateSpecifier.indexOf(inputElem.value),
          1
        );
      }
    }
  }

  protected submitSortHandler(e:Event){
    e.preventDefault()

    const radioButtons = document.querySelectorAll(".sort-radio-input")
    for(let i = 0; i< radioButtons.length ;i++){
        const elem = <HTMLInputElement> radioButtons[i]
        elem.checked = false
    }
    this.$emit('sortBool',this.bool)
    this.$emit('stateSpecifier',this.stateSpecifier)
    this.$emit('prioritySpecifier',this.prioritySpecifier)
    this.stateSpecifier = [];
    this.prioritySpecifier = [];  

    
    this.bool = !this.bool
    
  }
}

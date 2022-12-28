/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue, Watch} from "vue-property-decorator";
import apolloClient from "@/apollo/apollo";
import gql from "graphql-tag";
import ITodo from "../../interfaces/ITodo";
import TodoForm from "../AddTodoForm/todoform.vue";
import Sort from "../Sort/sort.vue";



const GET_MY_TODOS = gql`
  query MyQuery {
    todos(order_by: { id: asc }) {
      id
      description
      isDone
      priority
    }
  }
`;

const DELETE_TODO = gql`
  mutation MyMutation($id: Int!) {
    delete_todos_by_pk(id: $id) {
      id
    }
  }
`;

const SET_TODO_ISDONE = gql`
  mutation MyMutation($id: Int!, $isDone: Boolean!) {
    update_todos_by_pk(pk_columns: { id: $id }, _set: { isDone: $isDone }) {
      id
    }
  }
`;

const SET_TODO_DESC = gql`
  mutation MyMutation($id: Int!, $description: String!) {
    update_todos_by_pk(
      pk_columns: { id: $id }
      _set: { description: $description }
    ) {
      id
    }
  }
`;

@Component({
  components: {
    "todo-form": TodoForm,
    "sort":Sort,
  },
})
export default class Table extends Vue {
  @Prop({ default: "State" }) protected checkboxHeader?: string;
  @Prop({ default: "Priority" }) protected priorityHeader?: string;
  @Prop({ default: "Description" }) protected descriptionHeader?: string;
  @Prop({ default: "Action" }) protected actionsHeader?: string;

  protected todoArray: Array<ITodo> = [];
  protected displayedArr: Array<ITodo> = [];
  protected sortFlag = true ;

  protected stateSpecifier:Array<string> = [];
  protected prioritySpecifier:Array<string> = [];

  protected flagHandler(e:boolean){
    this.sortFlag = e;
  }

  protected stateSpecifierHandler(e:Array<string>):void{
    this.stateSpecifier = e;
  }

  protected prioritySpecifierHandler(e:Array<string>):void{
    this.prioritySpecifier = e;
  }


  

  
  
  public setTodoArray(todo: ITodo) {
    this.todoArray.push(todo);
  }



  protected async apollo() {
    const { data } = await apolloClient.query({
      query: GET_MY_TODOS,
    });

    return data;
  }

  protected async created() {
    const result = await this.apollo();
    this.todoArray = result.todos;
    this.displayedArr = this.todoArray
  }

  @Watch('sortFlag')onSortFlagChange(){
    this.sortDisplayedArr(this.prioritySpecifier, this.stateSpecifier)

  }

  protected sortDisplayedArr(priorityArr:Array<string>, stateArr:Array<string>){
    if(priorityArr.length === 0 && stateArr.length === 0){
      this.displayedArr = this.todoArray;
    }

    else if(priorityArr.length === 0 && stateArr.length > 0){
      const stateFlag = stateArr[0] === 'Done' ? true : false ;
      this.displayedArr = this.todoArray.filter(todo => todo.isDone === stateFlag)
    }

    else if(priorityArr.length > 0 && stateArr.length === 0){
      if(priorityArr.length === 1){
        this.displayedArr = this.todoArray.filter(todo => todo.priority === priorityArr[0])
      }
      else if(priorityArr.length === 2){
        this.displayedArr = this.todoArray.filter(todo => todo.priority === priorityArr[0]|| todo.priority === priorityArr[1])
      }
      else if(priorityArr.length === 3){
        this.displayedArr = this.todoArray.filter(todo => todo.priority === priorityArr[0]|| todo.priority === priorityArr[1]|| todo.priority === priorityArr[2])
      }
    }
    
    else{
      const stateFlag = stateArr[0] === 'Done' ? true : false ;

      if(priorityArr.length === 1){
        this.displayedArr = this.todoArray.filter(todo => (todo.priority === priorityArr[0])&&todo.isDone === stateFlag)
      }
      else if(priorityArr.length === 2){
        this.displayedArr = this.todoArray.filter(todo => (todo.priority === priorityArr[0]|| todo.priority === priorityArr[1]) && todo.isDone === stateFlag)
      }
      else if(priorityArr.length === 3){
        this.displayedArr = this.todoArray.filter(todo => (todo.priority === priorityArr[0]|| todo.priority === priorityArr[1]|| todo.priority === priorityArr[2])&&todo.isDone === stateFlag)
      }
    }

  }




  protected async deleteHandler(index: number) {
    const deleteId = this.displayedArr![index].id
    const pos = this.todoArray.findIndex(todo => todo.id === deleteId)
    this.displayedArr!.splice(index, 1);
    this.todoArray.splice(pos,1)

    await apolloClient.mutate({
      mutation: DELETE_TODO,
      variables: {
        id: deleteId,
      },
    });
  }

  protected async checkHandler(index: number) {
    const editId = this.displayedArr![index].id;
    const checkState = this.displayedArr![index].isDone;
    //const pos = this.todoArray!.findIndex(todo => todo.id === editId)
    this.displayedArr![index].isDone = !checkState 
    await this.$nextTick();
    this.sortDisplayedArr(this.prioritySpecifier, this.stateSpecifier)

    await apolloClient.mutate({
      mutation: SET_TODO_ISDONE,
      variables: {
        id: editId,
        isDone: !checkState,
      },
    });
  }

  protected async labelHandler(index: number, e: KeyboardEvent) {
    const elem = <HTMLElement>e.target;

    if (e.key == "Enter") {
      const editId = this.displayedArr[index].id;
      const desc = elem.innerText;
      elem.contentEditable = "false";
      await this.$nextTick();
      this.displayedArr![index].description = desc;
      
      await apolloClient.mutate({
        mutation: SET_TODO_DESC,
        variables: {
          id: editId,
          description: desc,
        },
      });
    }
    elem.contentEditable = "true";
  }

  protected async blurHandler(index: number, e: Event) {
    const editId = this.displayedArr[index].id;
    const elem = <HTMLElement>e.target;
    const desc = elem.innerText;
    await this.$nextTick();
    this.displayedArr![index].description = desc;
    

    await apolloClient.mutate({
      mutation: SET_TODO_DESC,
      variables: {
        id: editId,
        description: desc,
      },
    });
  }
}

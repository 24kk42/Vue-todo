/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue, Watch} from "vue-property-decorator";
import apolloClient from "@/apollo/apollo";
import gql from "graphql-tag";
import ITodo from "../../interfaces/ITodo";
import TodoForm from "../AddTodoForm/todoform.vue";



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
  },
})
export default class Table extends Vue {
  @Prop({ default: "State" }) protected checkboxHeader?: string;
  @Prop({ default: "Priority" }) protected priorityHeader?: string;
  @Prop({ default: "Description" }) protected descriptionHeader?: string;
  @Prop({ default: "Action" }) protected actionsHeader?: string;

  protected todoArray: Array<ITodo> = [];
  protected displayedArr: Array<ITodo> = [];
  protected filterStr = 'all';
  
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

  @Watch("filterStr") filterStringChangeHandler(){
    this.filterDisplayedArr();

  }

  
  protected filterDisplayedArr(): void{
    if(this.filterStr === 'done'){
      this.displayedArr = this.todoArray.filter(todo => todo.isDone === true)
    }
    else if(this.filterStr ==='notdone'){
      this.displayedArr= this.todoArray.filter(todo => todo.isDone === false)
    }

    else if(this.filterStr === 'all'){
      this.displayedArr = this.todoArray
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
    this.filterDisplayedArr();

    await apolloClient.mutate({
      mutation: SET_TODO_ISDONE,
      variables: {
        id: editId,
        isDone: !checkState,
      },
    });
  }

  protected async labelHandler(index: number, e: KeyboardEvent) {
    const editId = this.todoArray[index].id;
    const elem = <HTMLElement>e.target;
    const desc = elem.innerText;

    if (e.key == "Enter") {
      elem.contentEditable = "false";
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
    const editId = this.todoArray[index].id;
    const elem = <HTMLElement>e.target;
    const desc = elem.innerText;
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

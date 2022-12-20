/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Prop, Vue } from "vue-property-decorator";
import apolloClient from "@/apollo/apollo";
import gql from "graphql-tag";
import ITodo from "../../interfaces/ITodo";
import TodoForm from "../AddTodoForm/todoform.vue";

const GET_MY_TODOS = gql`
  query MyQuery {
    todos(order_by: {id: asc}) {
      id
      description
      isDone
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
    update_todos_by_pk(pk_columns: {id: $id}, _set: {isDone: $isDone}) {
    id
  }
}
`

const SET_TODO_DESC = gql`
  mutation MyMutation($id: Int!, $description: String!) {
    update_todos_by_pk(pk_columns: {id: $id}, _set: {description: $description}) {
      id
    }
  }
`


@Component({
  components:{
    "todo-form":TodoForm
  }
})
export default class Table extends Vue {
  
  @Prop({ default: "State" }) protected checkboxHeader?: string;
  @Prop({ default: "ID" }) protected idHeader?: string;
  @Prop({ default: "Description" }) protected descriptionHeader?: string;
  @Prop({ default: "Action" }) protected actionsHeader?: string;

  public todoArray : Array<ITodo> = [];


  public setTodoArray(todo:ITodo){
    this.todoArray.push(todo)
   
  }



  public async getTodoArray(){
    const { data } = await apolloClient.query({
      query: GET_MY_TODOS,
    });

    const arr = data.todos

    return arr
  }

  protected async apollo() {
    const { data } = await apolloClient.query({
      query: GET_MY_TODOS,
    });

    return data;
  }

  protected async created() {

    const result = await this.apollo();
    this.todoArray =  result.todos;
  }

  protected async deleteHandler(id: number) {
    const deleteId = this.todoArray[id].id;
    this.todoArray.splice(id, 1);

    await apolloClient.mutate({
      mutation: DELETE_TODO,
      variables: {
        id: deleteId,
      },
    });
  }

  protected async checkHandler(id:number){
    const editId = this.todoArray[id].id
    const checkState = this.todoArray[id].isDone
    await apolloClient.mutate({
      mutation: SET_TODO_ISDONE,
      variables: {
        id: editId,
        isDone: !checkState,
      }
    })
  }

  protected async labelHandler(index:number, e:KeyboardEvent){
    const editId = this.todoArray[index].id
    const elem = <HTMLElement> e.target
    if(e.key == "Enter"){
      elem.contentEditable= "false"
      await apolloClient.mutate({
        mutation: SET_TODO_DESC,
        variables: {
          id: editId,
          description: elem.innerHTML
        }
      })
    }
    elem.contentEditable = 'true'
  }

  protected async blurHandler(index:number, e:Event){
    const editId = this.todoArray[index].id
    const elem = <HTMLElement> e.target
    const desc = elem.innerHTML
    await apolloClient.mutate({
      mutation: SET_TODO_DESC,
      variables: {
        id:editId,
        description: desc
      }
    })
  }
  

}

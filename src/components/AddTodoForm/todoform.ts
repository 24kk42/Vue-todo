/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue } from "vue-property-decorator";
import Table from "../Table/table";
import gql from "graphql-tag";
import apolloClient from "@/apollo/apollo";

const INSERT_TODO = gql`
  mutation MyMutation($description : String!, $priority : String!) {
    insert_todos(objects: {description: $description, priority: $priority}) {
      returning {
        id
      }
    }
  }
`;

@Component
export default class TodoForm extends Vue {
  protected table = new Table();
  protected priority = "Low";

  protected async radioButtonHandler(e:Event){
    const elem = <HTMLInputElement> e.target
    this.priority = elem.value
  }

  protected async submitHandler(e: Event) {
    e.preventDefault()
    const radioButtons = document.querySelectorAll(".radio-input")
    for(let i = 0; i< radioButtons.length ;i++){
      const elem = <HTMLInputElement> radioButtons[i]
      elem.checked = false
    }
    const elem = <HTMLInputElement>this.$refs.formInput;

    const {data} = await apolloClient.mutate({
      mutation: INSERT_TODO,
      variables: {
        description: elem.value,
        priority: this.priority
      },
    });

    const lastId = data.insert_todos.returning[0].id

    this.table.setTodoArray({
      id: lastId,
      isDone: false,
      description: elem.value,
      priority: this.priority
    });


    elem.value = "";
    this.priority = "Low"
  }
}

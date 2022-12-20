/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Component, Vue } from "vue-property-decorator";
import Table from "../Table/table";
import gql from "graphql-tag";
import apolloClient from "@/apollo/apollo";

const INSERT_TODO = gql`
  mutation MyMutation($description : String!) {
    insert_todos(objects: {description: $description}) {
      returning {
        id
      }
    }
  }
`;

@Component
export default class TodoForm extends Vue {
  protected table = new Table();

  protected async submitHandler(e: Event) {
    e.preventDefault();

    const elem = <HTMLInputElement>this.$refs.formInput;

    const {data} = await apolloClient.mutate({
      mutation: INSERT_TODO,
      variables: {
        description: elem.value,
      },
    });

    const lastId = data.insert_todos.returning[0].id

    this.table.setTodoArray({
      id: lastId,
      isDone: false,
      description: elem.value,
    });

    elem.value = "";
  }
}

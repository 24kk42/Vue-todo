import { Component, Prop, Vue } from "vue-property-decorator";
import apolloClient from '@/apollo/apollo';
import gql from 'graphql-tag'
import ITodo from "../../interfaces/ITodo"

const GET_MY_TODOS = gql`
  query MyQuery {
    todos {
      description
      id
      isDone
    }
}
`

const DELETE_TODO = gql`
    mutation MyMutation($id:Int!) {
        delete_todos_by_pk(id:$id) {
         id
    }
}
`



@Component
export default class Table extends Vue {
    @Prop({default:""}) protected checkboxHeader ?: string  ;
    @Prop({default:"ID"}) protected idHeader ?: string ;
    @Prop({default:"Description"}) protected descriptionHeader ?: string ;
    @Prop({default:"Action"}) protected actionsHeader ?: string ;

    protected todoArray : Array<ITodo> = []

    protected async apollo(){
        const {data} = await apolloClient.query({
            query : GET_MY_TODOS
        })

        return data;
    }

    protected async mounted() {
        const result = await this.apollo() ;

        this.todoArray = result.todos;

    }

    protected async deleteHandler(id:number){
        
        const deleteId = this.todoArray[id].id
        this.todoArray.splice(id,1)
        
        await apolloClient.mutate({
            mutation: DELETE_TODO,
            variables : {
                id:deleteId
            },

        });
        
    }

    
}
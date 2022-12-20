<template>
  <div class="page">
    <NavBar></NavBar>
    <div class="body">
      <Table></Table>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Table from './components/Table/table.vue'
import NavBar from './components/NavBar/navbar.vue'
import TodoForm from './components/AddTodoForm/todoform.vue';

@Component({
  components: {
    NavBar,
    Table,
    TodoForm,

  },
})
export default class App extends Vue { }
</script>

<style lang="scss">
body {
  margin: 0;
}

.body {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
}
</style>

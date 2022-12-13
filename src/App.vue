<template>
  <div>
    <TodoItem description="123xx"></TodoItem >
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TodoItem from './components/todo-item.vue';

@Component({
  components: {
    TodoItem,
  },
})
export default class App extends Vue { }
</script>

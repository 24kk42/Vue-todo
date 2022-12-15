<template>
  <div>
    <Table></Table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Table from './components/Table/table.vue'

@Component({
  components: {
    Table,

  },
})
export default class App extends Vue { }
</script>

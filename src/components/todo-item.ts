import { Component, Prop, Vue } from 'vue-property-decorator';
@Component
export default class Todo extends Vue {
  @Prop() private description ?: string;
}
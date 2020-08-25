import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { Editor, EditorContent } from 'tiptap';

@Component({
  components: {
    EditorContent
  }
})
export default class EditorComponent extends Vue {
  @Prop({ default: '' })
  public content!: string;

  public mounted() {}
}

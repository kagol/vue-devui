import { defineComponent } from 'vue'

export default defineComponent({
  name: 'd-alert',
  props: {
  },
  setup(props, ctx) {
    return () => {
      return <div>devui-alert</div>
    }
  }
})
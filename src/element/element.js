import { Select, Option, Button, Input, Row, Col } from 'element-ui'

const element = {
    install: function (Vue) {
      Vue.use(Select)
      Vue.use(Option)
      Vue.use(Button)
      Vue.use(Input)
      Vue.use(Row)
      Vue.use(Col)
    }
  }
  export default element

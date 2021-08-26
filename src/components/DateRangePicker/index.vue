
<script>
import { DatePicker, DatePickerOptions } from 'element-ui'
import { calendarShortcuts } from '@/utils/shortcuts'
export default {
  name: 'DateRangePicker',
  mixins: [DatePicker],
  props: {
    type: {
      type: String,
      default: 'daterange'
    },
    valueFormat: {
      type: String,
      default: 'yyyy-MM-dd HH:mm:ss'
    },
    defaultTime: {
      type: Array,
      default: _ => ['00:00:00', '23:59:59']
    },
    pickerOptions: {
      type: DatePickerOptions,
      default: _ => {
        return { shortcuts: calendarShortcuts }
      }
    },
    size: {
      type: String,
      default: 'small'
    },
    rangeSeparator: {
      type: String,
      default: ':'
    },
    startPlaceholder: {
      type: String,
      default: '开始日期'
    },
    endPlaceholder: {
      type: String,
      default: '结束日期'
    }
  }
}
</script>
<style lang="scss" scoped>
// 日历开始
.el-date-editor {
  height: 30px;
  width: 229px;
  padding: 2px 3px;
}
.el-input--medium .el-input__icon{
  line-height: 30px;
}
.el-range-editor--medium .el-range__icon, .el-range-editor--medium .el-range__close-icon {
  line-height: 24px;
}
.el-range-separator {
  line-height: 24px;
  font-size: 12px;
}
.el-range-input {
  font-size: 13px;
}
// 日历结束
</style>

const Mock = require('mockjs')
const Random = Mock.Random
const reqRoles = require('./roles')
const { roles } = reqRoles
let List = []
const count = 5
function getArray(list, pid) {
  const arr = []
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === pid) {
      return (list[i].children)
    } else {
      getArray(list[i], pid)
    }
  }
  return arr
}
const toolData = {
  bedType: [{
    id: 1,
    label: '高新区'
  }, {
    id: 2,
    label: '姑苏区'
  }, {
    id: 3,
    label: '莲都区'
  }]
}

function renderArray(list) {
  for (let i = 0; i < list.length; i++) {
    list[i].children = []
    for (let j = 0; j < 3; j++) {
      list[i].children.push({
        id: Random.increment(),
        pid: list[i].id,
        timestamp: +Mock.Random.date('T'),
        label: list[i].name + '公厕',
        name: list[i].name + '公厕',
        deptNum: '@natural( 10, 30 )',
        'status|1': ['published', 'closed'],
        createTime: '@datetime',
        updateTime: '@datetime'
      })
    }
  }
  return list
}
for (let i = 0; i < count; i++) {
  const id = Random.increment()
  const name = Random.ctitle(2)
  // const hasChildren = Random.boolean()
  List.push(Mock.mock({
    id,
    timestamp: +Mock.Random.date('T'),
    'label': '丽水市' + name + '镇',
    name: name + '镇',
    deptNum: '@natural( 10, 30 )',
    'status|1': ['published', 'closed'],
    createTime: '@datetime',
    'createBy|1': roles,
    'updateBy|1': roles,
    updateTime: '@datetime'
  }))
}
List = renderArray(List)
module.exports = [{
  url: '/getDept',
  type: 'get',
  response: config => {
    console.log(config.query)
    const {
      // importance,
      // type,
      id,
      pid,
      title,
      page = 1,
      limit = 20,
      sort,
      area
    } = config.query

    //  条件筛选
    const mockList = List.filter(item => {
      if (id && item.id !== Number(id)) return false
      // 区域相同
      if (area) {
        const areares = toolData.bedType.find(item => Number(area) === item.id)
        return areares.label === item.houseType
      }
      //   if (importance && item.importance !== +importance) return false
      //   if (type && item.type !== type) return false
      if (title && (item.name.indexOf(title) === -1 || Number(title) === item.id)) return false
      return true
    })
    // d递归
    if (pid) {
      const childrens = getArray(List, Number(pid))
      return {
        code: 0,
        data: {
          total: childrens.length,
          list: childrens
        }
      }
    }
    // 数据排序
    if (sort) {
      const attr = sort.substring(1)
      if (sort.charAt(0) === '+') {
        mockList.sort((a, b) => a[attr] - b[attr])
      } else {
        mockList.sort((a, b) => b[attr] - a[attr])
      }
    }
    // 分页处理
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 0,
      data: {
        total: mockList.length,
        list: pageList
      }
    }
  }
},
{
  url: '/getDeptChildren',
  type: 'get',
  response: config => {
    // const { pid } = config.query
    return {
      code: 0,
      data: 'success'
    }
  }
}
]

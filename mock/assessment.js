const Mock = require('mockjs')
const List = []
const count = 100
const toolData = {
  areaType: [{
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
for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    'title|1': '@county(true)' + '@ctitle(2)' + '公厕',
    'assessment': '@cparagraph(1, 1)',
    'remark': '@cparagraph(1, 2)',
    'urls': [
      'https://img1.baidu.com/it/u=3001644141,3297622367&fm=26&fmt=auto&gp=0.jpg', 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
      'https://img1.baidu.com/it/u=1057811771,891744509&fm=26&fmt=auto&gp=0.jpg'
    ],
    'adminArea|1': ['高新区', '姑苏区', '莲都区'],
    address: '@county(true)' + '人民路西公厕',
    'status | 1': ['published', 'deleted', 'draft'],
    score: '@integer(1, 3)',
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    createTime: '@date(yyyy-MM-dd)'
  }))
}

module.exports = [{
  url: '/getAssessments',
  type: 'get',
  response: config => {
    const {
      importance,
      // type,
      title,
      page = 1,
      limit = 20,
      sort,
      area
      // people
    } = config.query
    console.log(config.query)
    console.log('传来的数据')

    //  条件筛选
    const mockList = List.filter(item => {
      if (area) {
        const areares = toolData.areaType.find(item => Number(area) === item.id)
        return areares.label === item.adminArea
      }
      if (importance && item.importance !== +importance) return false
      if (title && (item.title.indexOf(title) === -1 || Number(title) === item.id)) return false
      return true
    })

    // 数据排序
    if (sort) {
      const attr = sort.substring(1)
      if (sort.charAt(0) === '+') {
        mockList.sort((a, b) => a[attr] - b[attr])
      } else {
        mockList.sort((a, b) => b[attr] - a[attr])
      }
    }
    // 数据分页
    const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

    return {
      code: 0,
      data: {
        total: mockList.length,
        list: pageList,
        toolData
      }
    }
  }
},
{
  url: '/getWcInfo',
  type: 'get',
  response: config => {
    const { id } = config.query
    console.log('查询ID', id)
    const data = List.find((value) => Number(id) === value.id)
    console.log(data)
    data.urls = [
      'https://img1.baidu.com/it/u=3001644141,3297622367&fm=26&fmt=auto&gp=0.jpg', 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
      'https://img1.baidu.com/it/u=1057811771,891744509&fm=26&fmt=auto&gp=0.jpg', 'https://img1.baidu.com/it/u=1134133333,1493534922&fm=26&fmt=auto&gp=0.jpg',
      'https://img2.baidu.com/it/u=3689597684,2671025458&fm=26&fmt=auto&gp=0.jpg'
    ]
    return {
      code: 0,
      data
    }
  }
}
]

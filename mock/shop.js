const Mock = require('mockjs')

const List = []
const count = 1000

const baseContent = '<p>I am testing data, I am testing data.</p><p><img src="https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943"></p>'
const image_uri = 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3'
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

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    businessId: '@natural( 0, 4 )',
    timestamp: +Mock.Random.date('T'),
    'houseType|1': ['高新区', '姑苏区', '莲都区'],
    businessName: '@county(true)' + '@ctitle(2)' + '公厕',
    urls: ['https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943'],
    housePrice: '@natural( 100, 460 )',
    originalPrice: '@natural( 100, 460 )',
    extent: '@natural( 10, 30 )',
    'status | 1': ['published', 'deleted', 'draft'],
    content: baseContent,
    forecast: '@float(0, 100, 2, 2)',
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime',
    comment_disabled: true,
    pageviews: '@integer(300, 5000)',
    image_uri,
    platforms: ['a-platform']
  }))
}

module.exports = [{
  url: '/subscribe/getSubscribeHouse',
  type: 'get',
  response: config => {
    console.log(config.query)
    const {
      // importance,
      // type,
      title,
      page = 1,
      limit = 20,
      sort,
      businessId,
      area
    } = config.query

    //  条件筛选
    const mockList = List.filter(item => {
      // ID相同
      if (Number(businessId) !== item.businessId) return false
      // 区域相同
      if (area) {
        const areares = toolData.bedType.find(item => Number(area) === item.id)
        return areares.label === item.houseType
      }
      //   if (importance && item.importance !== +importance) return false
      //   if (type && item.type !== type) return false
      if (title && (item.businessName.indexOf(title) === -1 || Number(title) === item.id)) return false
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
    // 分页处理
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
  url: '/subscribe/deleteSubscribeHouse',
  type: 'delete',
  response: config => {
    console.log(config)
    return {
      code: 0,
      data: 'success'
    }
  }
}
]

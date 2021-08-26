const Mock = require('mockjs')
const Random = Mock.Random
const List = []
const count = 100
const area = []
for (let i = 0; i < count; i++) {
  area.push({
    label: Random.province(),
    value: '@integer(1, 100)',
    children: [{
      label: Random.city(),
      value: '@integer(101, 1000)'
    },
    {
      label: Random.city(),
      value: '@integer(101, 1000)'
    },
    {
      label: Random.city(),
      value: '@integer(101, 1000)'
    }]
  })
}

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    timestamp: +Mock.Random.date('T'),
    'title|1': '@county(true)' + '@ctitle(2)' + '公厕',
    'urls|1': [
      'https://img1.baidu.com/it/u=3001644141,3297622367&fm=26&fmt=auto&gp=0.jpg', 'https://wpimg.wallstcn.com/e4558086-631c-425c-9430-56ffb46e70b3', 'https://wpimg.wallstcn.com/4c69009c-0fd4-4153-b112-6cb53d1cf943',
      'https://img1.baidu.com/it/u=1057811771,891744509&fm=26&fmt=auto&gp=0.jpg', 'https://img1.baidu.com/it/u=1134133333,1493534922&fm=26&fmt=auto&gp=0.jpg',
      'https://img2.baidu.com/it/u=3689597684,2671025458&fm=26&fmt=auto&gp=0.jpg'
    ],
    'position|1': [
      ['@float( 119.7, 119.9, 6, 6 )', '@float( 28, 28.4, 6, 6 )'],
      ['@float( 119.7, 119.9, 6, 6 )', '@float( 28, 28.4, 6, 6 )'],
      ['@float( 119.7, 119.9, 6, 6 )', '@float( 28, 28.4, 6, 6 )']
    ],
    heatmap_count: {
      lng: '@float( 119.7, 119.9, 6, 6 )',
      lat: '@float( 28, 28.4, 6, 6 )',
      count: '@natural( 50, 160 )'
    },
    address: '@county(true)' + '人民路西公厕',
    originalPrice: '@natural( 100, 460 )',
    people: '@natural( 10, 30 )',
    wcLeader: '@cname',
    'status | 1': ['published', 'deleted', 'draft'],
    importance: '@integer(1, 3)',
    'type|1': ['CN', 'US', 'JP', 'EU'],
    'status|1': ['published', 'draft'],
    display_time: '@datetime'
  }))
}

module.exports = [{
  url: '/getWcMontior',
  type: 'get',
  response: config => {
    const {
      title,
      page = 1,
      limit = 20,
      sort
    } = config.query
    console.log(config.query)
    console.log('传来的数据')
    let mockList = List.filter(item => {
      // 筛选ID相同
      //   if (importance && item.importance !== +importance) return false
      //   if (type && item.type !== type) return false
      if (title && item.title.indexOf(title) < 0) return false
      return true
    })

    if (sort === '-id') {
      mockList = mockList.reverse()
    }
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
  url: '/getWcArea',
  type: 'get',
  response: config => {
    console.log(config)
    return {
      code: 0,
      data: {
        list: area
      }
    }
  }
},
{
  url: '/getWcInfo',
  type: 'get',
  response: config => {
    const { id } = config.query
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


const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  },
  wcmanger: {
    token: 'wcmanger-token'
  },
  nokx: {
    token: 'user-token'
  }
}
const List = [
  {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    dept: { id: 2, name: '研发部' },
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    nickName: '测试',
    email: 'test@el-admin.vip',
    phone: '18888888889',
    id: 0
  },
  {
    roles: ['editor'],
    introduction: 'I am an editor',
    dept: { id: 2, name: '研发部' },
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    id: 1,
    nickName: '测试',
    email: 'test@el-admin.vip',
    phone: '18888888889'
  },
  {
    roles: ['wcmanger'],
    introduction: '所长，厕所所长',
    dept: { id: 2, name: '研发部' },
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '厕所所长',
    enabled: false,
    gender: '男',
    nickName: '测试',
    email: 'test@el-admin.vip',
    phone: '18888888889',
    id: 3
  },
  {
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: '测试账号',
    createBy: 'admin',
    createTime: '2020-05-05 11:15:49',
    dept: { id: 2, name: '研发部' },
    nickName: '测试',
    email: 'test@el-admin.vip',
    phone: '18888888889',
    enabled: true,
    gender: '男',
    id: 2,
    jobs: [{ id: 12, name: '软件测试' }],
    roles: [{ dataScope: '自定义', id: 2, level: 2, name: '普通用户' }, 'admin'],
    updateBy: 'admin',
    updateTime: '2020-09-05 10:43:38',
    name: '测试'
  }
]
const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin',
    id: 0
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor',
    id: 1
  },
  'wcmanger-token': {
    roles: ['wcmanger'],
    introduction: '所长，厕所所长',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: '厕所所长',
    id: 3
  },
  'user-token': {
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    introduction: '测试账号',
    createBy: 'admin',
    createTime: '2020-05-05 11:15:49',
    dept: { id: 2, name: '研发部' },
    email: 'test@el-admin.vip',
    enabled: true,
    gender: '男',
    id: 2,
    jobs: [{ id: 12, name: '软件测试' }],
    nickName: '测试',
    phone: '18888888889',
    roles: [{ dataScope: '自定义', id: 2, level: 2, name: '普通用户' }, 'admin'],
    updateBy: 'admin',
    updateTime: '2020-09-05 10:43:38',
    name: '测试'
  }
}
module.exports = [
  // user login
  {
    url: '/login/password/check',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]
      // mock error
      if (!token) {
        return {
          code: 60204,
          message: '账号不对，需要输入已有的mock账号.'
        }
      }

      return {
        code: 0,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/login/password/getuser',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Token validation failed, Check mock'
        }
      }

      return {
        code: 0,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/verify/logout',
    type: 'post',
    response: _ => {
      return {
        code: 0,
        data: 'success'
      }
    }
  },
  {
    url: '/getUsers',
    type: 'get',
    response: _ => {
      return {
        code: 0,
        data: {
          code: 0,
          list: List,
          total: List.length
        }
      }
    }
  }
]

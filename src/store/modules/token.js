import Cookie from '@/utils/cookie'
import UserApi from '@/api/user'
import store from '../index'
import Vue from 'vue'
import message, { notify } from '@/utils/notify'

const TOKEN_KEY = "TOKEN_KEY"
const token = {
    state: {
        token: Cookie.getAttribute(TOKEN_KEY)
    },

    mutations: {
        SET_TOKEN: (state, value) => {
            state.token = value
            Cookie.setAttribute(TOKEN_KEY, value, 30)
        },
        REMOVE_TOKEN: (state) => {
            state.token = null
            Cookie.remove(TOKEN_KEY)
        }
    },

    actions: {
        Authentication({ commit }, accessToken) {
            UserApi.verifyToken(accessToken).then((response) => {
                let result = response.data
                let githubUsername = store.state.configuration.githubUsername
                if (githubUsername == result['login']) {
                    commit('SET_TOKEN', accessToken)
                    notify({
                        title: '成功',
                        message: 'Token绑定成功',
                        type: 'success'
                    })
                    // message({
                    //     message: 'Token绑定成功',
                    //     type: 'success'
                    // })
                } else {
                    message({
                        message: 'Token用户不一致',
                        type: 'error'
                    })
                }
            }).catch((err) => {
                // 具体原因（401 Token 无效 / 403 限流 / 网络错误）已由 src/utils/request.js
                // 的响应拦截器统一弹出，这里不再弹第二条，否则手机会连弹两个对话框。
                console.error('[token] 绑定校验失败', err)
            })
        },
        Cancellation({ commit }) {
            commit('REMOVE_TOKEN')
            message({
                message: 'Token取消绑定',
                type: 'info'
            })
        },
    }
}

export default token
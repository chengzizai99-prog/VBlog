import Vue from 'vue'
import Router from 'vue-router'
import util from '@/utils/util'

// 移动端首页，设备判断统一走 util.isMobile()
const MOBILE_HOME = '/mobile/user/blog/main'

// 路由级懒加载：每个页面单独打包，首屏只下载当前路由需要的代码。
// 原来 23 个页面全部静态 import，首屏必须把桌面端和移动端所有页面一次性拉下来。
const Error404 = () => import('@/views/error/Error404')
const Layout = () => import('@/views/layout/Layout')

const NewMain = () => import('@/views/new/Main')
const SocialMain = () => import('@/views/social/Main')
const SocialDetails = () => import('@/views/social/Details')
const BlogMain = () => import('@/views/blog/Main')
const BlogAdd = () => import('@/views/blog/Add')
const BlogEdit = () => import('@/views/blog/Edit')
const BlogDetails = () => import('@/views/blog/Details')
const ProjectMain = () => import('@/views/project/Main')
const ProjectDetails = () => import('@/views/project/Details')
const ReadmeMain = () => import('@/views/readme/Main')
const ConfigureMain = () => import('@/views/configure/Main')
const HelperMain = () => import('@/views/helper/Main')

const MobileLayout = () => import('@/mobile_views/layout/Layout')
const MobileBlogMain = () => import('@/mobile_views/blog/Main')
const MobileBlogDetails = () => import('@/mobile_views/blog/Details')
const MobileProjectMain = () => import('@/mobile_views/project/Main')
const MobileProjectDetails = () => import('@/mobile_views/project/Details')
const MobileSelfMain = () => import('@/mobile_views/self/Main')



Vue.use(Router)

export const constantRouterMap = [

    {
        path: '/user/new',
        redirect: '/user/new/main',
        component: Layout,
        meta: {
            type: "user",
            icon: 'el-icon-star-off',
            title: '最新动态'
        },
        children: [
            {
                path: 'main',
                component: NewMain,
                meta: { title: '最新动态' }
            }
        ]
    },
    {
        path: '/user/social',
        redirect: '/user/social/main',
        component: Layout,
        meta: {
            type: "user",
            icon: 'el-icon-mobile-phone',
            title: '社交圈'
        },
        children: [
            {
                path: 'main',
                component: SocialMain,
                meta: { title: '社交圈' }
            },
            {
                path: 'details/:name',
                component: SocialDetails,
                meta: { title: '用户资料' }
            }
        ]
    },
    {
        path: '/user/blog',
        redirect: '/user/blog/main',
        component: Layout,
        meta: {
            type: "user",
            icon: 'el-icon-edit-outline',
            title: '博客列表'
        },
        children: [
            {
                path: 'main',
                component: BlogMain,
                meta: { title: '博客列表' }
            },
            {
                path: 'add',
                component: BlogAdd,
                meta: { title: '发表博客' }
            },
            {
                path: 'edit/:id',
                component: BlogEdit,
                meta: { title: '编辑博客' }
            },
            {
                path: 'details/:id',
                component: BlogDetails,
                meta: { title: '博客详情' }
            }
        ]
    },
    {
        path: '/user/project',
        redirect: '/user/project/main',
        component: Layout,
        meta: {
            type: "user",
            icon: 'el-icon-service',
            title: '开源项目'
        },
        children: [
            {
                path: 'main',
                component: ProjectMain,
                meta: { title: '项目列表' }
            },
            {
                path: 'details/:name',
                component: ProjectDetails,
                meta: { title: '项目详情' }
            }
        ]
    },
    {
        path: '/user/helper',
        redirect: '/user/helper/main',
        component: Layout,
        meta: {
            type: "user",
            icon: 'el-icon-printer',
            title: '使用帮助',
            mini: true
        },
        children: [
            {
                path: 'main',
                component: HelperMain,
                meta: { title: '使用帮助' }
            }
        ]
    },
    {
        path: '/user/readme',
        redirect: '/user/readme/main',
        component: Layout,
        meta: {
            type: "user",
            icon: 'el-icon-document',
            title: 'README.md'
        },
        children: [
            {
                path: 'main',
                component: ReadmeMain,
                meta: { title: 'README.md' }
            }
        ]
    },
    {
        path: '/user/configure',
        redirect: '/user/configure/main',
        component: Layout,
        meta: {
            type: "user",
            icon: 'el-icon-setting',
            title: '系统配置',
            LoginRequired: true
        },
        children: [
            {
                path: 'main',
                component: ConfigureMain,
                meta: { title: '系统配置' }
            }
        ]
    },

    //mobile
    {
        path: '/mobile/user/blog',
        redirect: '/mobile/user/blog/main',
        component: MobileLayout,
        meta: {
            type: "mobile",
            icon: 'edit',
            title: '博客'
        },
        children: [
            {
                path: 'main',
                component: MobileBlogMain,
                meta: {
                    scrollTop: true
                }
            },
            {
                path: 'details/:id',
                component: MobileBlogDetails,
                meta: {
                    scrollTop: true
                }
            }
        ]

    },
    {
        path: '/mobile/user/project',
        redirect: '/mobile/user/project/main',
        component: MobileLayout,
        meta: {
            type: "mobile",
            icon: 'like-o',
            title: '项目'
        },
        children: [
            {
                path: 'main',
                component: MobileProjectMain,
                meta: {
                    scrollTop: true
                }
            },
            {
                path: 'details/:name',
                component: MobileProjectDetails,
                meta: {
                    scrollTop: true
                }
            }
        ]

    },
    {
        path: '/mobile/user/self',
        redirect: '/mobile/user/self/main',
        component: MobileLayout,
        meta: {
            type: "mobile",
            icon: 'contact',
            title: '个人'
        },
        children: [
            {
                path: 'main',
                component: MobileSelfMain,
                meta: {
                    scrollTop: true
                }
            }
        ]

    },

    // 兜底必须放最后：vue-router 按顺序匹配，'*' 放在移动端路由前面会把
    // /mobile/user/blog 这类地址全部吃掉，手机端永远进不了移动布局。
    {
        path: "/404",
        component: Error404
    },
    {
        path: '/',
        redirect: '/user/new',
    },
    {
        path: "*",
        redirect: "/404"
    },
]




const router = new Router({
    routes: constantRouterMap,
    scrollBehavior(to, from, savedPosition) {
        if (to.meta.scrollTop) {
            return { x: 0, y: 0 }
        }
    }
})

router.beforeEach((to, from, next) => {
    Vue.prototype.$setTitle(to.meta.title)
    // 设备与布局不匹配时改道。放在全局守卫里，而不是 App.vue 的 created：
    // 初始导航还没结束时 $router.push 会被丢掉，手机上早年表现就是停在桌面布局。
    const mobileDevice = util.isMobile()
    const mobilePath = to.path.indexOf('/mobile/') === 0
    if (mobileDevice && !mobilePath && to.path.indexOf('/user') === 0) {
        next(MOBILE_HOME)
        return
    }
    if (!mobileDevice && mobilePath) {
        next('/')
        return
    }
    next()
})



export default router
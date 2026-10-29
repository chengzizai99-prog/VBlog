<template>
    <div id="app">
        <router-view/>
    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    export default {
        name: 'App',
        computed: {
            ...mapGetters([
                'githubUsername',
                'htmlTitle'
            ])
        },
        watch: {
            // configuration.json 是异步拉回来的：created 时 htmlTitle 还是空串，
            // 首屏标签页标题就变成空白。等配置到位再补一次标题。
            htmlTitle() {
                this.$setTitle(this.$route.meta.title)
            }
        },
        created() {
            // 配置是异步的，先等 configuration.json 回来再请求用户信息，
            // 否则 githubUsername 还是空串，请求会打到 /users/ 上。
            this.$store.dispatch("Init").then(() => this.$store.dispatch("GetInfo"))
            this.$setTitle(this.$route.meta.title)
            // 移动端/桌面端的改道已移到 src/router/index.js 的全局守卫（util.isMobile()），
            // 这里再 push 会在初始导航未结束时被丢掉。
        }
    }
</script>
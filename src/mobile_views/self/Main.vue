<template>

    <div :style="'background: #f8f8f8;min-height: '+windowSize.height+'px'">
        <van-nav-bar style="position:fixed;top:0;z-index: 9999; box-shadow: 0px -3px 10px #888888;width: 100%;" title="个人中心" />
        <div style="height: 60px;"></div>
        <van-row style="background: #ffffff;" class="mobile-border">
            <van-col span="8" style="padding: 10px 10px 5px 10px">
                <img :src="avatarUrl" style="margin-right: 10px;width:100px; height:100px; border-radius:5px; border: 1px solid #EBEEF5"
                />
            </van-col>
            <van-col span="16" style="padding: 10px 10px 0px 10px">
                <font style="color:#303133;font-size: 18px;line-height:33px;">{{githubUsername}}</font>
                <br>
                <font style="color:#606266;font-size: 13px;line-height:13px;">
                    <van-icon name="contact" />&emsp;{{name}}</font>
                <br>
                <font style="color:#606266;font-size: 13px;line-height:13px;">
                    <van-icon name="location" />&emsp;{{location}}</font>
                <br>
                <font style="color:#606266;font-size: 13px;line-height:13px;">粉丝&nbsp;{{followersTotal}}</font>&emsp;
                <font style="color:#606266;font-size: 13px;line-height:13px;">关注&nbsp;{{followingTotal}}</font>
            </van-col>
        </van-row>

        <!-- Token 绑定入口：Token 存在各浏览器自己的 Cookie 里，电脑上绑了手机上也要能绑 -->
        <van-cell class="mobile-border mobile-margin-top" :title="token ? '　Token 已绑定 · 点此更换' : '　绑定 Token'"
            icon="setting" is-link @click="openToken" />

        <van-cell class="mobile-border mobile-margin-top" :title="'　' + githubProfileText" :url="githubProfileUrl" icon="sign"
            is-link />

        <van-cell class="mobile-border mobile-margin-top" title="　项目源码" icon="logistics" url="https://github.com/GitHub-Laziji/VBlog"
            is-link />

        <van-cell class="mobile-border mobile-margin-top" title="　其他博客" icon="password-view" :url="blog" is-link />

        <!-- Token 弹层用自己的 fixed 遮罩：vant 1.1.2 的 van-popup 在本页会被
             过渡样式推到视口外（实测 top=844px），按钮点不到，所以不套 popup -->
        <div v-if="showToken" class="token-mask" @click.self="closeToken">
            <div class="token-panel">
                <div style="font-size: 16px;color: #303133;margin-bottom: 4px;">{{ token ? '更换 Token' : '绑定 Token' }}</div>
                <div style="font-size: 12px;color: #969799;margin-bottom: 12px;">
                    在 GitHub 生成一个有 repo 权限的 personal access token，粘贴到下面。Token 只存在本机浏览器 Cookie 里。
                </div>
                <van-field v-model="tokenInput" type="text" placeholder="粘贴 accessToken"
                    style="border: 1px solid #EBEEF5;margin-bottom: 12px;" />
                <van-button type="primary" size="large" @click="submitToken">确定</van-button>
                <van-button size="large" style="margin-top: 8px;" @click="closeToken">取消</van-button>
                <van-button v-if="token" size="large" style="margin-top: 8px; color: #ee0a24;" @click="unbindToken">解除绑定</van-button>
            </div>
        </div>

    </div>
</template>

<style scoped>
.token-mask {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 20000;
    display: flex;
    align-items: flex-end;
}

.token-panel {
    background: #ffffff;
    width: 100%;
    padding: 16px 16px 24px 16px;
    box-sizing: border-box;
    border-radius: 8px 8px 0 0;
}
</style>

<script>
    import { mapGetters } from 'vuex'
    export default {
        data() {
            return {
                windowSize: this.$util.getWindowSize(),
                showToken: false,
                tokenInput: ''
            }
        },
        computed: {
            ...mapGetters([
                'token',
                'githubUsername',
                'avatarUrl',
                'name',
                'location',
                'blog',
                'followersTotal',
                'followingTotal'
            ]),
            githubProfileUrl() {
                return this.githubUsername ? 'https://github.com/' + this.githubUsername : ''
            },
            githubProfileText() {
                return this.githubUsername ? 'github.com/' + this.githubUsername : '　GitHub 账号未配置'
            }
        },
        mounted() {
        },
        methods: {
            openToken() {
                this.tokenInput = ''
                this.showToken = true
            },
            closeToken() {
                this.showToken = false
                this.tokenInput = ''
            },
            submitToken() {
                let value = (this.tokenInput || '').trim()
                if (!value) {
                    this.$toast('请先粘贴 accessToken')
                    return
                }
                this.showToken = false
                this.tokenInput = ''
                this.$store.dispatch('Authentication', value)
            },
            unbindToken() {
                this.showToken = false
                this.tokenInput = ''
                this.$store.dispatch('Cancellation')
            }
        }
    }
</script>

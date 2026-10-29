import Vue from 'vue'

// Element 与 Vant 现在按布局懒加载（见 src/plugins/），登录、校验 token 这类早期流程
// 可能发生在布局挂载之前，两个库都可能还不存在。提示降级链：
//   Element 的 $message/$notify → Vant 的 $dialog/$toast → console
// 任何一层都不允许静默失败：手机上绑 token 成功或失败，用户必须看得见。
function textOf(option) {
    if (!option) {
        return ''
    }
    return option.message || option.title || ''
}

function vantDialog(title, text) {
    const dialog = Vue.prototype.$dialog
    if (!dialog || typeof dialog.alert !== 'function' || !text) {
        return false
    }
    dialog.alert({ title: title || '提示', message: text })
    return true
}

function vantToast(type, text) {
    const toast = Vue.prototype.$toast
    if (typeof toast !== 'function' || !text) {
        return false
    }
    // vant 1.1.2 的 toast 只有 text/success/fail/loading 几种 type，没有 element 的 error
    toast({ type: type, message: text, duration: 2500 })
    return true
}

export function message(option) {
    if (typeof Vue.prototype.$message === 'function') {
        Vue.prototype.$message(option)
        return
    }
    const text = textOf(option)
    const type = option && option.type
    // 失败要用户确认，用 dialog；成功/普通提示用 toast，不挡住操作
    if (type === 'error' && vantDialog('提示', text)) {
        return
    }
    if (type !== 'error' && vantToast(type === 'success' ? 'success' : 'text', text)) {
        return
    }
    console.error('[message]', text)
}

export function notify(option) {
    if (typeof Vue.prototype.$notify === 'function') {
        Vue.prototype.$notify(option)
        return
    }
    const text = textOf(option)
    const type = option && option.type
    if (type === 'error' && vantDialog(option.title || '提示', text)) {
        return
    }
    if (type !== 'error' && vantToast(type === 'success' ? 'success' : 'text', text)) {
        return
    }
    console.error('[notify]', text)
}

export default message

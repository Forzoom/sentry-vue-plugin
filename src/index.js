/**
 * Vue.js 2.0 plugin
 *
 */
'use strict';

function formatComponentName(vm) {
    if (vm.$root === vm) {
        return 'root instance';
    }
    const name = vm._isVue
        ? vm.$options.name || vm.$options._componentTag
        : vm.name;
    return (name ? 'component <' + name + '>' : 'anonymous component') +
        (vm._isVue && vm.$options.__file ? ' at ' + vm.$options.__file : '');
}

/**
 * 是否是我们所需要处理的Error
 */
function isTargetError(error) {
    if (error) {
        console.log('[customer vue plugin]', error.message);
        if (error.message && error.message.indexOf('WeixinJSBridge') !== -1) {
            return true;
        } else {
            return false;
        }
    }
    return false;
}

export default function vuePlugin(Raven, Vue) {
    Vue = Vue || window.Vue;

    // quit if Vue isn't on the page
    if (!Vue || !Vue.config) return;

    const _oldOnError = Vue.config.errorHandler;
    Vue.config.errorHandler = function VueErrorHandler(error, vm) {
        // 屏蔽WeixinJSBridge错误
        if (!isTargetError(error)) {
            Raven.captureException(error, {
                extra: {
                    componentName: formatComponentName(vm),
                    propsData: vm.$options.propsData,
                },
            });
        }

        // 保证兼容其他错误上报
        if (typeof _oldOnError === 'function') {
            _oldOnError.call(this, error, vm);
        }
    };
}

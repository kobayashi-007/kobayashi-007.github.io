
// 浏览器语言自动检测和跳转脚本
(function() {
    // 定义语言映射表（统一不带尾斜杠）
    var langMap = {
        'zh': 'https://blog.187322.xyz',
        'zh-CN': 'https://blog.187322.xyz',
        'zh-HK': 'https://blog.187322.xyz/hk',
        'zh-TW': 'https://blog.187322.xyz/hk',
        'en': 'https://blog.187322.xyz/en',
        'ja': 'https://blog.187322.xyz/ja'
    };

    // 本地存储键名
    var LANG_STORAGE_KEY = 'user-lang-choice';

    // 检查是否需要自动跳转
    function shouldRedirect() {
        // 如果用户已经选择过语言，不要自动跳转
        var userChoice = localStorage.getItem(LANG_STORAGE_KEY);
        if (userChoice) {
            return false;
        }
        return true;
    }

    // 获取浏览器首选语言
    function getBrowserLang() {
        var lang;
        
        // 尝试从 navigator.languages 获取（优先级最高）
        if (navigator.languages &amp;&amp; navigator.languages.length) {
            for (var i = 0; i &lt; navigator.languages.length; i++) {
                var browserLang = navigator.languages[i].toLowerCase();
                // 检查精确匹配
                if (langMap[browserLang]) {
                    return browserLang;
                }
                // 检查前缀匹配
                var langPrefix = browserLang.split('-')[0];
                if (langMap[langPrefix]) {
                    return langPrefix;
                }
            }
        }
        
        // 尝试 navigator.language
        if (navigator.language) {
            lang = navigator.language.toLowerCase();
            if (langMap[lang]) return lang;
            var prefix = lang.split('-')[0];
            if (langMap[prefix]) return prefix;
        }
        
        // 尝试 navigator.userLanguage (IE)
        if (navigator.userLanguage) {
            lang = navigator.userLanguage.toLowerCase();
            if (langMap[lang]) return lang;
            var prefix = lang.split('-')[0];
            if (langMap[prefix]) return prefix;
        }
        
        // 默认返回简体中文
        return 'zh';
    }

    // 执行跳转
    function doRedirect() {
        if (!shouldRedirect()) {
            return;
        }
        
        var lang = getBrowserLang();
        var targetUrl = langMap[lang];
        
        if (targetUrl) {
            // 延迟跳转，让用户看到页面
            setTimeout(function() {
                window.location.href = targetUrl;
            }, 500);
        }
    }

    // 保存用户语言选择
    window.saveLangChoice = function(lang) {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
    };

    // 重置语言选择（清除存储）
    window.resetLangChoice = function() {
        localStorage.removeItem(LANG_STORAGE_KEY);
    };

    // 页面加载时执行
    document.addEventListener('DOMContentLoaded', doRedirect);
})();

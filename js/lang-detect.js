// 浏览器语言自动检测和跳转脚本
(function() {
    // 定义语言映射表（统一不带尾斜杠）
    var langMap = {
        'zh': 'https://blog.187322.xyz',
        'zh-CN': 'https://blog.187322.xyz',
        'zh-HK': 'https://blog.187322.xyz/hk',
        'zh-TW': 'https://blog.187322.xyz/hk',
        'en': 'https://blog.187322.xyz/en',
        'ja': 'https://blog.187322.xyz/ja',
        'ar': 'https://blog.187322.xyz/ar',
        'ar-sa': 'https://blog.187322.xyz/ar',
        'ar-eg': 'https://blog.187322.xyz/ar',
        'ar-ae': 'https://blog.187322.xyz/ar',
        'ar-iq': 'https://blog.187322.xyz/ar',
        'ar-jo': 'https://blog.187322.xyz/ar',
        'ar-kw': 'https://blog.187322.xyz/ar',
        'ar-lb': 'https://blog.187322.xyz/ar',
        'ar-ma': 'https://blog.187322.xyz/ar',
        'ar-om': 'https://blog.187322.xyz/ar',
        'ar-qa': 'https://blog.187322.xyz/ar',
        'ar-sy': 'https://blog.187322.xyz/ar',
        'ar-tn': 'https://blog.187322.xyz/ar',
        'ar-ye': 'https://blog.187322.xyz/ar'
    };

    // URL 到语言代码的反向映射
    var urlToLang = {
        'https://blog.187322.xyz': 'zh',
        'https://blog.187322.xyz/hk': 'hk',
        'https://blog.187322.xyz/en': 'en',
        'https://blog.187322.xyz/ja': 'ja',
        'https://blog.187322.xyz/ar': 'ar'
    };

    // 本地存储键名
    var LANG_STORAGE_KEY = 'user-lang-choice';

    // 检查 localStorage 是否可用
    function isLocalStorageAvailable() {
        try {
            var key = '__test_local_storage__';
            localStorage.setItem(key, key);
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            return false;
        }
    }

    // 获取当前页面的语言代码
    function getCurrentPageLang() {
        var currentUrl = window.location.origin + window.location.pathname;
        currentUrl = currentUrl.replace(/\/$/, '');
        
        // 检查精确匹配
        if (urlToLang[currentUrl]) {
            return urlToLang[currentUrl];
        }
        
        // 检查路径前缀匹配（适用于子页面）
        for (var url in urlToLang) {
            if (currentUrl.startsWith(url + '/') || currentUrl === url) {
                return urlToLang[url];
            }
        }
        
        // 默认返回中文
        return 'zh';
    }

    // 检查是否需要自动跳转
    function shouldRedirect() {
        // 如果用户已经选择过语言，不要自动跳转
        if (isLocalStorageAvailable()) {
            var userChoice = localStorage.getItem(LANG_STORAGE_KEY);
            if (userChoice) {
                return false;
            }
        }
        
        // 如果当前页面已经是一个有效的语言版本页面，不要自动跳转
        // 这可以防止用户手动切换语言后又被自动跳转回去
        var currentLang = getCurrentPageLang();
        
        // 如果当前不在主站（zh），说明用户可能是手动切换过来的，不自动跳转
        if (currentLang !== 'zh') {
            // 在非主站页面，保存当前语言作为用户选择，防止后续跳转
            if (isLocalStorageAvailable()) {
                localStorage.setItem(LANG_STORAGE_KEY, currentLang);
            }
            return false;
        }
        
        return true;
    }

    // 获取浏览器首选语言
    function getBrowserLang() {
        var lang;
        var englishMatch = null;
        
        if (navigator.languages && navigator.languages.length) {
            for (var i = 0; i < navigator.languages.length; i++) {
                var browserLang = navigator.languages[i].toLowerCase();
                if (langMap[browserLang]) {
                    if (browserLang.startsWith('en')) {
                        englishMatch = browserLang;
                    } else {
                        return browserLang;
                    }
                }
                var langPrefix = browserLang.split('-')[0];
                if (langMap[langPrefix]) {
                    if (langPrefix === 'en') {
                        englishMatch = langPrefix;
                    } else {
                        return langPrefix;
                    }
                }
            }
        }
        
        if (englishMatch) {
            return englishMatch;
        }
        
        if (navigator.language) {
            lang = navigator.language.toLowerCase();
            if (langMap[lang]) return lang;
            var prefix = lang.split('-')[0];
            if (langMap[prefix]) return prefix;
        }
        
        if (navigator.userLanguage) {
            lang = navigator.userLanguage.toLowerCase();
            if (langMap[lang]) return lang;
            var prefix = lang.split('-')[0];
            if (langMap[prefix]) return prefix;
        }
        
        return 'zh';
    }

    // 检查当前页面是否已经是目标语言版本
    function isCurrentUrlTarget(targetUrl) {
        var currentUrl = window.location.origin + window.location.pathname;
        currentUrl = currentUrl.replace(/\/$/, '');
        targetUrl = targetUrl.replace(/\/$/, '');
        return currentUrl === targetUrl || currentUrl.startsWith(targetUrl + '/');
    }

    // 执行跳转
    function doRedirect() {
        if (!shouldRedirect()) {
            return;
        }
        
        var lang = getBrowserLang();
        var targetUrl = langMap[lang];
        
        if (targetUrl) {
            // 检查当前页面是否已经是目标语言版本，避免循环重定向
            if (isCurrentUrlTarget(targetUrl)) {
                // 如果已经在目标页面，保存语言选择以防止再次跳转
                if (isLocalStorageAvailable()) {
                    localStorage.setItem(LANG_STORAGE_KEY, lang);
                }
                return;
            }
            
            // 在跳转前先保存语言选择
            if (isLocalStorageAvailable()) {
                localStorage.setItem(LANG_STORAGE_KEY, lang);
            }
            
            setTimeout(function() {
                window.location.href = targetUrl;
            }, 500);
        }
    }

    // 保存用户语言选择
    window.saveLangChoice = function(lang) {
        if (isLocalStorageAvailable()) {
            localStorage.setItem(LANG_STORAGE_KEY, lang);
        }
    };

    // 重置语言选择（清除存储）
    window.resetLangChoice = function() {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem(LANG_STORAGE_KEY);
        }
    };

    // 页面加载时执行
    document.addEventListener('DOMContentLoaded', doRedirect);
})();
// 浏览器语言自动检测和跳转脚本
(function() {
    var baseUrl = window.location.origin;
    
    var langMap = {
        'zh': baseUrl,
        'zh-CN': baseUrl,
        'zh-HK': baseUrl + '/hk',
        'zh-TW': baseUrl + '/hk',
        'en': baseUrl + '/en',
        'ja': baseUrl + '/ja',
        'ar': baseUrl + '/ar',
        'ar-sa': baseUrl + '/ar',
        'ar-eg': baseUrl + '/ar',
        'ar-ae': baseUrl + '/ar',
        'ar-iq': baseUrl + '/ar',
        'ar-jo': baseUrl + '/ar',
        'ar-kw': baseUrl + '/ar',
        'ar-lb': baseUrl + '/ar',
        'ar-ma': baseUrl + '/ar',
        'ar-om': baseUrl + '/ar',
        'ar-qa': baseUrl + '/ar',
        'ar-sy': baseUrl + '/ar',
        'ar-tn': baseUrl + '/ar',
        'ar-ye': baseUrl + '/ar'
    };

    var pathToLang = {
        '/': 'zh',
        '/hk': 'hk',
        '/en': 'en',
        '/ja': 'ja',
        '/ar': 'ar'
    };

    var LANG_STORAGE_KEY = 'user-lang-choice';

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

    function getCurrentPageLang() {
        var currentPath = window.location.pathname;
        currentPath = currentPath.replace(/\/$/, '') || '/';
        
        if (pathToLang[currentPath]) {
            return pathToLang[currentPath];
        }
        
        for (var path in pathToLang) {
            if (currentPath.startsWith(path + '/') || currentPath === path) {
                return pathToLang[path];
            }
        }
        
        return 'zh';
    }

    function shouldRedirect() {
        if (isLocalStorageAvailable()) {
            var userChoice = localStorage.getItem(LANG_STORAGE_KEY);
            if (userChoice) {
                return false;
            }
        }
        
        var currentLang = getCurrentPageLang();
        
        if (currentLang !== 'zh') {
            if (isLocalStorageAvailable()) {
                localStorage.setItem(LANG_STORAGE_KEY, currentLang);
            }
            return false;
        }
        
        return true;
    }

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

    function isCurrentUrlTarget(targetUrl) {
        var currentUrl = window.location.origin + window.location.pathname;
        currentUrl = currentUrl.replace(/\/$/, '');
        targetUrl = targetUrl.replace(/\/$/, '');
        return currentUrl === targetUrl || currentUrl.startsWith(targetUrl + '/');
    }

    function doRedirect() {
        if (!shouldRedirect()) {
            return;
        }
        
        var lang = getBrowserLang();
        var targetUrl = langMap[lang];
        
        if (targetUrl) {
            if (isCurrentUrlTarget(targetUrl)) {
                if (isLocalStorageAvailable()) {
                    localStorage.setItem(LANG_STORAGE_KEY, lang);
                }
                return;
            }
            
            if (isLocalStorageAvailable()) {
                localStorage.setItem(LANG_STORAGE_KEY, lang);
            }
            
            setTimeout(function() {
                window.location.href = targetUrl;
            }, 500);
        }
    }

    window.saveLangChoice = function(lang) {
        if (isLocalStorageAvailable()) {
            localStorage.setItem(LANG_STORAGE_KEY, lang);
        }
    };

    window.resetLangChoice = function() {
        if (isLocalStorageAvailable()) {
            localStorage.removeItem(LANG_STORAGE_KEY);
        }
    };

    document.addEventListener('DOMContentLoaded', doRedirect);
})();
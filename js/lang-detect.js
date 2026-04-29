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
})();
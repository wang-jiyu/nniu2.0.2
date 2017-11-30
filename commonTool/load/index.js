var files = {css: {}, script: {}};

module.exports = {
    loadCss: function(fileName, callback) {
        if (files.css[fileName]) return typeof(callback) == 'function' && callback(false);

        var css = document.createElement('link');
        css.type = 'text/css';
        css.rel = 'stylesheet';
        css.href = fileName;

        css.onload = css.onreadystatechange = function(e) {
            files.css[fileName] = e.currentTarget;
            typeof(callback) == 'function' && callback(true);
        }.bind(this);

        document.getElementsByTagName('head')[0].appendChild(css);
    },
    unloadCss: function(fileName) {
        if (files.css[fileName]) {
			files.css[fileName].remove();
			delete files.css[fileName];
			return true;
        }
        return false;
    },
    loadScript: function(fileName, callback) {
        if (files.script[fileName]) return typeof(callback) == 'function' && callback(false);

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = fileName;
        script.id = fileName;

        script.onload = script.onreadystatechange = function(e) {
            files.script[fileName] = e.currentTarget;
            typeof(callback) == 'function' && callback(true);
        }.bind(this);

        document.body.appendChild(script);
    },
    unloadScript: function(fileName) {
        if (files.script[fileName]) {
            files.script[fileName].remove();
            delete files.script[fileName];
			return true;
        }
		return false;
    }
};
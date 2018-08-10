!(function(self) {
    let head = document.getElementsByTagName('head')[0];

    self.loaded = function(aURL) {
        var ok = false,
            us = aURL.toLowerCase(),
            sa = [].map.call(document.scripts, function(x) {
                return x.src;
            }).concat(
                [].map.call(document.styleSheets, function(x) {
                    return x.href;
                })
            );

        sa.forEach(function(st) {
            if (st && st.toLowerCase().indexOf(us) >= 0) {
                ok = true;
            }
        });
        return ok;
    },

    self.inject = function(aResourceList, aReadyCallback) {
        let ls = aResourceList.length;

        function load(aURL, aLoadedCallback) {
            let rn;

            if (self.loaded(aURL)) {
                aLoadedCallback();
                return;
            }
            if (aURL.indexOf('.css') > 0 || aURL.indexOf('fonts.googleapis.com') > 0) {
                rn = document.createElement('link');
                rn.href = aURL;
                rn.media ='screen';
                rn.rel = 'stylesheet';
                rn.type = 'text/css';
            } else {
                if (aURL.indexOf('.html') > 0) {
                    rn = document.createElement('link');
                    rn.rel  = 'import';
                    rn.href = aURL;
                    rn.async = true;
                } else { // Assume JavaScript (.js, .ashx).
                    rn = document.createElement('script');
                    rn.src = aURL;
                    rn.async = true;
                }
            }
            rn.onload = aLoadedCallback;
            head.appendChild(rn);
        }
        aResourceList.forEach(function(rc) {
            load(rc, function() {
                if (--ls === 0) {
                    (aReadyCallback || function(){})();
                }
            });
        });
    };

})(window.Loader = {});

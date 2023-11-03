// noinspection DuplicatedCode

(function ($) {
    $.fn.lazy = function (options) {
        let elements = $(this);
        const DEFAULTS = {
            onBeforeLoad(element) {
            },
            onLoad(element) {
            },
            onError(element) {
            },
            onCompleted(element) {
            }
        };

        let unobserve = 0;

        const settings = $.extend({}, DEFAULTS, options || {});

        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let element = entry.target;
                    resolve(element);
                    imageObserver.unobserve(element);


                }
            });
        });

        elements.each(function (i, image) {
            imageObserver.observe(image);
        });

        function checkFinished(){
            const done = elements.length === unobserve;
            if(done){
                settings.onCompleted();
            }
        }

        function resolve(element) {
            settings.onBeforeLoad(element);
            const ajaxLoad = element.hasAttribute("data-url");
            switch (true) {
                case ajaxLoad: {
                    $(element).load(element.dataset.url, {}, function () {
                        $(element).removeAttr('data-url');
                        settings.onLoad(element);
                        $(element).find('[data-src],[data-url]').each(function (i, e) {
                            imageObserver.observe(e);
                            elements = elements.add($(e));
                        });
                        unobserve++;
                        checkFinished();
                    });
                    break;
                }
                case $(element).is('img'): {
                    element.src = element.dataset.src;
                    element.onload = function () {
                        $(element).removeAttr('data-src');
                        settings.onLoad(this);
                        unobserve++;
                        checkFinished();
                    }
                    element.onerror = settings.onError(element);
                    break;
                }
                default: {
                    const tmpImage = new Image();
                    tmpImage.src = element.dataset.src;
                    tmpImage.onerror = settings.onError(element);
                    tmpImage.onload = function () {
                        element.style.backgroundImage = `url(${this.src})`;
                        $(element).removeAttr('data-src');
                        settings.onLoad(element);
                        unobserve++;
                        checkFinished();
                    }
                }
            }
        }
    };
}(jQuery));

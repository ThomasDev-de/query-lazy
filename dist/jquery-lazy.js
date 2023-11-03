// noinspection DuplicatedCode

(function ($) {
    $.fn.lazy = function (options) {
        const elements = $(this);
        const countElements = elements.length;
        let finished = 0;
        const DEFAULTS = {
            beforeLoad(element) {},
            afterLoad(element) {},
            onError(element){},
            onFinishedAll(){}
        };

        const settings = $.extend({}, DEFAULTS, options || {});

        function show(element) {
            settings.beforeLoad(element);
            switch (true) {
                case $(element).is('img'): {
                    element.src = element.dataset.src;
                    element.onload = function () {
                        $(element).removeAttr('data-src');
                        settings.afterLoad(this);
                    }
                    element.onerror = settings.onError(element);
                    break;
                }
                default: {
                    const tmpImage = new Image();
                    tmpImage.src = element.dataset.src;
                    tmpImage.onerror = settings.onError(element);
                    tmpImage.onload = function(){
                        element.style.backgroundImage = `url(${this.src})`;
                        $(element).removeAttr('data-src');
                        settings.afterLoad(element);
                    }
                }
            }

            finished++;
            if(finished === countElements){
                settings.onFinishedAll();
            }
        }

        if ("IntersectionObserver" in window) {
            let imageObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        let element = entry.target;
                        show(element);
                        imageObserver.unobserve(element);
                    }
                });
            });

            elements.each(function (i, image) {
                imageObserver.observe(image);
            });
        } else {
            let lazyLoadThrottleTimeout;

            function lazyLoad() {
                if (lazyLoadThrottleTimeout) {
                    clearTimeout(lazyLoadThrottleTimeout);
                }

                lazyLoadThrottleTimeout = setTimeout(function () {
                    const scrollTop = window.scrollY;
                    elements.each(function (i, img) {
                        if (img.offsetTop < (window.innerHeight + scrollTop)) {
                            show(img);
                        }
                    });
                    if (elements.length === 0) {
                        document.removeEventListener("scroll", lazyLoad);
                        window.removeEventListener("resize", lazyLoad);
                        window.removeEventListener("orientationChange", lazyLoad);
                    }
                }, 20);
            }

            document.addEventListener("scroll", lazyLoad);
            window.addEventListener("resize", lazyLoad);
            window.addEventListener("orientationChange", lazyLoad);
        }


    };
}(jQuery));

// noinspection DuplicatedCode,JSUnusedLocalSymbols,JSMissingSwitchBranches,JSUnusedGlobalSymbols

(function ($) {
    $.fn.getSize = function () {
        const $wrap = $("<div />").appendTo($("body"));
        $wrap.css({
            "position": "absolute !important",
            "visibility": "hidden !important",
            "display": "block !important"
        });

        const $clone = $(this).clone().appendTo($wrap);

        const sizes = {
            "width": $clone.width(),
            "height": $clone.height()
        };

        $wrap.remove();
        return sizes;
    };

    /**
     *
     * @param {object|undefined} options
     * @return {*|jQuery|HTMLElement}
     */
    $.fn.lazy = function (options = {}) {
        const elem = $(this);
        let elements = [];
        const validAttributes = ['data-lazy-src', 'data-lazy-url'];
        /**
         * the default options
         * @type {{onError(*), classLoading: string, onBeforeLoad(*), classStatic: string, onCompleted(*), onLoad(*), classWaiting: string, recursive: boolean, classDone: string}}
         */
        const DEFAULTS = {
            recursive: true,
            classStatic: 'lazy',
            classWaiting: 'lazy-waiting',
            classLoading: 'lazy-loading',
            classDone: 'lazy-done',
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

        /**
         * merge default with user options
         */
        const settings = $.extend({}, DEFAULTS, options || {});

        const imageObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    let element = entry.target;
                    $(element).removeClass(settings.classWaiting).addClass(settings.classLoading);
                    resolve(element);
                    imageObserver.unobserve(element);
                }
            });
        });

        elem.each(function (i, e) {
            /**
             * register only valid attributes
             */
            if (e.hasAttribute(validAttributes[0]) || e.hasAttribute(validAttributes[1])) {
                elements.push($(e).addClass(settings.classWaiting +' '+settings.classStatic));
                imageObserver.observe(e);
            }
        });

        /**
         * check if all elements loaded
         */
        function checkFinished() {
            if (elements.length === unobserve) {
                settings.onCompleted();
            }
        }

        /**
         *
         * @param {string} name
         * @param {HTMLElement} element
         * @param {array} params
         */
        function trigger(name, element, params = []){
            $(element).trigger(`${name}.lazy`, params);
        }

        /**
         *
         * @param {HTMLElement} element
         */
        function resolve(element) {
            trigger('beforeLoad', element);
            settings.onBeforeLoad(element);
            switch (true) {
                case element.hasAttribute(validAttributes[1]): {
                    $.ajax({
                        dataType: 'html',
                        url: element.dataset.lazyUrl,
                        success: function (result) {
                            const $el = $(element);
                            $(element).html(result);
                            const sizes = $(element).getSize();

                            trigger('loaded', element, [sizes.width, sizes.height, window.scrollY, window.scrollX]);
                            settings.onLoad(element, sizes.width, sizes.height, window.scrollY, window.scrollX);

                            $(element)
                                .removeAttr('data-lazy-url')
                                .removeClass(settings.classLoading)
                                .addClass(settings.classDone);

                            if (settings.recursive) {
                                $(element).find('[' + validAttributes.join('],[') + ']').each(function (i, e) {
                                    $(e).addClass(settings.classWaiting +' '+settings.classStatic)
                                    imageObserver.observe(e);
                                    elements.push($(e));
                                });
                            }
                        },
                        error: function () {
                            settings.onError(element);
                        },
                        complete(){
                            unobserve++;
                            checkFinished();
                        }
                    });
                    break;
                }
                case $(element).is('img'): {
                    const img = new Image();
                    img.onload = function () {
                        const height = img.height;
                        const width = img.width;
                        element.src = img.src;
                        trigger('loaded', element, [width, height, window.scrollY, window.scrollX]);
                        $(element).removeAttr(validAttributes[0]).removeClass(settings.classLoading).addClass(settings.classDone);
                        settings.onLoad(element, width, height, window.scrollY, window.scrollX);
                        unobserve++;
                        checkFinished();
                    }
                    img.src = element.dataset.lazySrc;
                    img.onerror = settings.onError(element);
                    break;
                }
                default: {
                    const tmpImage = new Image();
                    tmpImage.src = element.dataset.lazySrc;
                    tmpImage.onerror = settings.onError(element);
                    tmpImage.onload = function () {
                        const height = tmpImage.height;
                        const width = tmpImage.width;
                        element.style.backgroundImage = `url(${this.src})`;
                        trigger('loaded',  element,[width, height, window.scrollY, window.scrollX]);
                        $(element).removeAttr(validAttributes[0]).removeClass(settings.classLoading).addClass(settings.classDone);

                        settings.onLoad(element, height, width, height, window.scrollY, window.scrollX);
                        unobserve++;
                        checkFinished();
                    }
                }
            }
        }

        return elem;
    };
}(jQuery));

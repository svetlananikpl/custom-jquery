(function () {
    var $ = function (elem) {
        return new $.fn.init(elem);
    };
    $.fn = {
        init: function (elem) {
            if (typeof elem == 'string') {
                let elements = document.querySelectorAll(elem);
                this.elements = Array.from(elements);
            } else {
                this.elements = [];
                this.elements.push(elem);
            }
            return this;
        },
        addClass: function (myNewClass) {
            if (typeof myNewClass == 'string') {
                myNewClass = myNewClass.indexOf(' ') < 0 ? myNewClass : myNewClass.split(' ');
                if (typeof myNewClass == 'string') {
                    this.elements.forEach(element =>
                        element.classList.add(myNewClass));
                } else {
                    this.elements.forEach(element =>
                        myNewClass.forEach(cssClass=>
                            element.classList.add(cssClass)));
                }
            } else {
                this.elements.forEach((element, index) => {
                    if (typeof myNewClass === 'function') {
                        const cssClasses = myNewClass.call(element, index, element.className);
                        $(element).addClass(cssClasses);
                    }
                })
            }
            return this;
        },
        append: function (newChild) {
            if (typeof newChild == 'string') {
                if (this.elements.length > 1) {
                    this.elements.forEach(element =>
                        element.innerHTML = newChild);
                } else {
                    this.elements[0].innerHTML = newChild;
                }

            } else {
                this.elements.forEach((element, index) => {
                    if (newChild.hasOwnProperty('elements')) {
                        element.appendChild(newChild.elements[0].cloneNode(true))
                    } else {
                        element.appendChild(newChild.cloneNode(true))
                    }
                });

            }
            return this;
        },
        html: function () {
            if (arguments.length == 0) {
                return this.elements[0].innerHTML;
            } else if (typeof arguments[0] == 'string') {
                this.elements.forEach(element =>
                    element.innerHTML = arguments[0]);
            }
            return this;
        },
        attr: function () {
            if (arguments.length == 1) {
                return this.elements[0].getAttribute(arguments[0]);
            } else {
                this.elements.forEach(element => {
                    for (let i = 0; i < arguments.length; i += 2) {
                        element.setAttribute(arguments[i], arguments[i + 1]);
                    }
                });
            }
            return this;
        },
        children: function () {
            if (arguments.length == 0) {
                return this.elements[0].children;
            } else {
                const elemSelected = $(arguments[0]).elements;
                let selectedChild = Array.from(this.elements[0].children);
                return selectedChild.filter(element => {
                    return elemSelected.indexOf(element) != -1;
                });
            }
        },
        css: function (cssProperty) {
            if (typeof cssProperty == 'string') {
                return this.elements[0].style[cssProperty];
            } else {
                let cssProps = Object.keys(cssProperty);
                this.elements.forEach(element => {
                    for (let prop in cssProperty) {
                        if (cssProperty.hasOwnProperty(prop)) {
                            element.style[prop] = cssProperty[prop];
                        }
                    }
                })
            }
            return this;
        },
        data: function () {
            if (arguments.length == 0) {
                return this.elements[0].dataset;
            } else if (arguments.length == 1) {
                if (typeof arguments[0] == 'string') {
                    return this.elements[0].dataset[arguments[0]];
                } else {
                    let newDatas = arguments[0];
                    this.elements.forEach(element => {
                        for (let prop in newDatas) {
                            if (newDatas.hasOwnProperty(prop)) {
                                element.dataset[prop] = newDatas[prop];
                            }
                        }
                    });
                }
            } else {
                for (let i = 0; i < arguments.length; i += 2) {
                    this.elements.forEach(element =>
                        element.dataset[arguments[i]] = arguments[i + 1]);
                }
            }
        },
        on: function () {
            let event = arguments[0];
            let callback = arguments[arguments.length - 1];
            if (arguments.length == 2) {
                this.elements[0].addEventListener(event, callback);
            } else {
                let selector = arguments[1];
                this.elements[0].addEventListener(event, (e, ...args)=> {
                    if ($(selector).elements.indexOf(e.target) != -1) {
                        callback(...args);
                    }
                });
            }
        },
        one: function () {
            let event = arguments[0];
            let callback = arguments[1];
            let that = this;

            function clickOnce(...args) {
                callback(...args);
                that.elements[0].removeEventListener(event, clickOnce);
            }

            this.elements[0].addEventListener(event, clickOnce);
        },

        each: function (callback) {
            let result = true;
            for (let i = 0; i < this.elements.length; i++) {
                if (callback.call(this.elements[i], i, this.elements[i]) === false) {
                    result = false;
                    break;
                }
            }
            return result ? this : result;
        }
    };
    $.fn.init.prototype = $.fn;
    window.$ = $;
})();



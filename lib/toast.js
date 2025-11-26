/**
 * Hot Toast Library - Lightweight Toast Notification System
 * Version: 2.0.2
 * Updated: 2025-11-26 (CSS Animation Fixes)
 */

(function(window) {
    'use strict';

    // --- Helpers ---

    const getIconInfo = (type) => {
        switch(type) {
            case 'success': return { class: 'bi-check-lg', title: 'Success' };
            case 'error': return { class: 'bi-x-lg', title: 'Error' };
            case 'warning': return { class: 'bi-exclamation-lg', title: 'Warning' };
            case 'info': return { class: 'bi-info-lg', title: 'Info' };
            case 'loading': return { class: 'bi-arrow-clockwise spin-animation', title: 'Loading' };
            default: return { class: 'bi-bell-fill', title: 'Notification' };
        }
    };

    const createIconElement = (type, customIcon) => {
        const iconDiv = document.createElement('div');
        iconDiv.className = 'toast-icon';

        if (customIcon) {
            const customIconDiv = document.createElement('div');
            customIconDiv.className = 'custom-icon';
            customIconDiv.textContent = customIcon;
            iconDiv.appendChild(customIconDiv);
        } else if (type === 'loading') {
            const loaderWrapper = document.createElement('div');
            loaderWrapper.className = 'toast-loader-wrapper';
            const loader = document.createElement('div');
            loader.className = 'toast-loader';
            loaderWrapper.appendChild(loader);
            iconDiv.appendChild(loaderWrapper);
        } else {
            const { class: iconClass } = getIconInfo(type);
            const iTag = document.createElement('i');
            iTag.className = `bi ${iconClass}`;
            iconDiv.appendChild(iTag);
        }
        return iconDiv;
    };

    // --- Main Toast Object ---

    const Toast = {
        config: {
            position: 'top-right',
            duration: 4000,
            maxToasts: 5,
            reverseOrder: false,
            gutter: 12
        },
        container: null,
        toasts: [],
        id: 0,

        init() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = `toast-container ${this.config.position}`;
                document.body.appendChild(this.container);
            }
        },

        configure(options) {
            Object.assign(this.config, options);
            if (this.container) {
                this.container.className = `toast-container ${this.config.position}`;
            }
        },

        create(message, type, options = {}) {
            this.init();
            const id = ++this.id;
            const duration = options.duration !== undefined ? options.duration : this.config.duration;
            const { title: defaultTitle } = getIconInfo(type);
            const title = options.title || defaultTitle;

            // 1. Create Toast Structure
            const toastElement = document.createElement('div');
            toastElement.className = `toast-notification ${type || 'default'}`;
            if (options.className) toastElement.classList.add(options.className);
            if (options.style) toastElement.style.cssText += options.style;
            toastElement.setAttribute('data-toast-id', id);

            // 2. Icon
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'toast-icon-wrapper';
            iconWrapper.appendChild(createIconElement(type, options.icon));
            toastElement.appendChild(iconWrapper);

            // 3. Content
            const contentDiv = document.createElement('div');
            contentDiv.className = 'toast-content';
            
            const titleDiv = document.createElement('div');
            titleDiv.className = 'toast-title';
            titleDiv.textContent = title;
            
            const descDiv = document.createElement('div');
            descDiv.className = 'toast-description';
            descDiv.textContent = message;
            
            contentDiv.appendChild(titleDiv);
            contentDiv.appendChild(descDiv);
            toastElement.appendChild(contentDiv);

            // 4. Wrapper & Animation
            const wrapper = document.createElement('div');
            wrapper.className = 'toast-wrapper';
            wrapper.appendChild(toastElement);

            const isTop = this.config.position.includes('top');
            const shouldAppend = isTop ? this.config.reverseOrder : !this.config.reverseOrder;

            if (shouldAppend) {
                this.container.appendChild(wrapper);
            } else {
                this.container.insertBefore(wrapper, this.container.firstChild);
            }

            // Trigger Entry Animation
            requestAnimationFrame(() => {
                wrapper.offsetHeight; // Force reflow
                wrapper.style.height = `${toastElement.offsetHeight}px`;
                wrapper.classList.add('visible');
                setTimeout(() => { wrapper.style.height = 'auto'; }, 400);
            });

            // 5. State Management
            const toast = { id, element: toastElement, wrapper, type, timeout: null };
            this.toasts.push(toast);

            if (this.toasts.length > this.config.maxToasts) {
                this.remove(this.toasts[0].id);
            }

            if (duration > 0 && type !== 'loading') {
                toast.timeout = setTimeout(() => this.remove(id), duration);
            }

            // Dispatch event for external listeners (e.g., analytics, counters)
            window.dispatchEvent(new CustomEvent('hot-toast:created', { detail: { id, type, message } }));

            return id;
        },

        update(id, message, type) {
            const toast = this.toasts.find(t => t.id === id);
            if (!toast) return;

            // Update Text
            const desc = toast.element.querySelector('.toast-description');
            if (desc) desc.textContent = message;

            // Update Type & Icon
            if (type) {
                toast.element.className = `toast-notification ${type}`;
                
                const iconWrapper = toast.element.querySelector('.toast-icon-wrapper');
                if (iconWrapper) {
                    iconWrapper.innerHTML = ''; // Clear old icon
                    iconWrapper.appendChild(createIconElement(type));
                }

                const titleDiv = toast.element.querySelector('.toast-title');
                if (titleDiv) {
                    const { title: defaultTitle } = getIconInfo(type);
                    titleDiv.textContent = defaultTitle;
                }

                // Reset Timeout if switching from loading
                if (toast.type === 'loading' && type !== 'loading') {
                    if (toast.timeout) clearTimeout(toast.timeout);
                    toast.timeout = setTimeout(() => this.remove(id), this.config.duration);
                }
                toast.type = type;
            }
        },

        remove(id) {
            const index = this.toasts.findIndex(t => t.id === id);
            if (index === -1) return;
            
            const toast = this.toasts[index];
            this.toasts.splice(index, 1);
            if (toast.timeout) clearTimeout(toast.timeout);
            
            // Exit Animation
            const wrapper = toast.wrapper;
            wrapper.style.height = `${wrapper.offsetHeight}px`;
            // wrapper.style.overflow = 'hidden'; // Removed to allow slide-out
            wrapper.classList.remove('visible');
            
            wrapper.offsetHeight; // Force reflow
            
            wrapper.style.height = '0px';
            wrapper.style.marginBottom = '0px';
            wrapper.style.opacity = '0';
            
            setTimeout(() => {
                if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
            }, 600);
        },
        
        removeAll() {
            [...this.toasts].forEach(t => this.remove(t.id));
        }
    };

    // --- Public API ---

    function createToast(type, arg1, arg2, arg3) {
        let message = arg1;
        let options = {};

        if (arg3 !== undefined) {
            options.title = arg1;
            message = arg2;
            options.duration = arg3;
        } else if (typeof arg2 === 'number') {
            options.duration = arg2;
        } else if (typeof arg2 === 'object') {
            options = arg2;
        }
        return Toast.create(message, type, options);
    }

    window.toast = (arg1, arg2, arg3) => createToast('default', arg1, arg2, arg3);
    window.toast.success = (arg1, arg2, arg3) => createToast('success', arg1, arg2, arg3);
    window.toast.error = (arg1, arg2, arg3) => createToast('error', arg1, arg2, arg3);
    window.toast.warning = (arg1, arg2, arg3) => createToast('warning', arg1, arg2, arg3);
    window.toast.info = (arg1, arg2, arg3) => createToast('info', arg1, arg2, arg3);
    window.toast.loading = (message, options) => Toast.create(message, 'loading', options);
    
    window.toast.update = (id, message, type) => Toast.update(id, message, type);
    window.toast.dismiss = (id) => {
        if (id) {
            Toast.remove(id);
        } else {
            Toast.removeAll();
        }
    };
    window.toast.config = (options) => Toast.configure(options);
    window.toast.version = '2.0.2';
    
    window.toast.promise = (promise, messages, options) => {
        const id = Toast.create(messages.loading || 'Loading...', 'loading', options);
        promise
            .then(res => {
                Toast.update(id, messages.success || 'Success!', 'success');
                return res;
            })
            .catch(err => {
                Toast.update(id, messages.error || 'Error!', 'error');
                throw err;
            });
        return promise;
    };

})(window);

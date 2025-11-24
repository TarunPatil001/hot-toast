/**
 * Hot Toast Library - Lightweight Toast Notification System
 * Updated: 2025-11-24 (Debug Version)
 * 
 * @description A lightweight, customizable toast notification library
 * @version 1.2.0
 * 
 * Usage:
 *   toast("Default message");
 *   toast.success("Operation successful!");
 *   toast.error("Something went wrong!");
 *   toast.loading("Processing...");
 *   toast.promise(promise, { loading: 'Saving...', success: 'Saved!', error: 'Failed!' });
 * 
 * Configuration:
 *   toast.config({ position: 'top-right', duration: 4000, maxToasts: 5, reverseOrder: false });
 * 
 * Options:
 *   - icon: Custom emoji or icon
 *   - duration: Display duration in milliseconds (0 = no auto-dismiss)
 *   - style: Custom CSS styles
 *   - className: Additional CSS classes
 */

(function(window) {
    'use strict';
    console.log('Toast JS: Script started');

    const Toast = {
        config: {
            position: 'top-right',
            duration: 4000,
            maxToasts: 5,
            reverseOrder: false,
            gutter: 8
        },
        container: null,
        toasts: [],
        id: 0,

        /**
         * Initialize the toast container
         */
        init: function() {
            if (!this.container) {
                this.container = document.createElement('div');
                this.container.className = 'toast-container ' + this.config.position;
                document.body.appendChild(this.container);
            }
        },

        /**
         * Update toast configuration
         * @param {Object} options - Configuration options
         */
        configure: function(options) {
            Object.assign(this.config, options);
            if (this.container) {
                this.container.className = 'toast-container ' + this.config.position;
            }
        },

        /**
         * Create a new toast notification
         * @param {string} message - Toast message
         * @param {string} type - Toast type (success, error, loading, or blank)
         * @param {Object} options - Additional options
         * @returns {number} Toast ID
         */
        create: function(message, type, options) {
            this.init();

            // Dispatch event for analytics/counters
            try {
                window.dispatchEvent(new CustomEvent('hot-toast:created', { 
                    detail: { message, type, options } 
                }));
            } catch (e) {
                // Ignore errors if event dispatch fails
            }

            const id = ++this.id;
            const duration = options && options.duration !== undefined ? options.duration : this.config.duration;
            const isTop = this.config.position.includes('top');
            const positionClass = isTop ? 'top' : 'bottom';
            
            const toastElement = document.createElement('div');
            toastElement.className = 'toast-item ' + positionClass;
            toastElement.setAttribute('data-toast-id', id);

            // Icon handling
            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'toast-icon-wrapper';
            const customIcon = options && options.icon;
            
            if (customIcon) {
                const customIconElement = document.createElement('div');
                customIconElement.className = 'toast-icon-animated';
                customIconElement.style.fontSize = '20px';
                customIconElement.textContent = customIcon;
                iconWrapper.appendChild(customIconElement);
            } else if (type === 'success') {
                const loader = document.createElement('div');
                loader.className = 'toast-loader';
                iconWrapper.appendChild(loader);
                
                const statusWrapper = document.createElement('div');
                statusWrapper.className = 'toast-status-wrapper';
                const successIcon = document.createElement('div');
                successIcon.className = 'toast-success-icon';
                statusWrapper.appendChild(successIcon);
                iconWrapper.appendChild(statusWrapper);
            } else if (type === 'error') {
                const loader = document.createElement('div');
                loader.className = 'toast-loader';
                iconWrapper.appendChild(loader);
                
                const statusWrapper = document.createElement('div');
                statusWrapper.className = 'toast-status-wrapper';
                const errorIcon = document.createElement('div');
                errorIcon.className = 'toast-error-icon';
                statusWrapper.appendChild(errorIcon);
                iconWrapper.appendChild(statusWrapper);
            } else if (type === 'warning') {
                const loader = document.createElement('div');
                loader.className = 'toast-loader';
                iconWrapper.appendChild(loader);
                
                const statusWrapper = document.createElement('div');
                statusWrapper.className = 'toast-status-wrapper';
                const warningIcon = document.createElement('div');
                warningIcon.className = 'toast-warning-icon';
                statusWrapper.appendChild(warningIcon);
                iconWrapper.appendChild(statusWrapper);
            } else if (type === 'info') {
                const loader = document.createElement('div');
                loader.className = 'toast-loader';
                iconWrapper.appendChild(loader);
                
                const statusWrapper = document.createElement('div');
                statusWrapper.className = 'toast-status-wrapper';
                const infoIcon = document.createElement('div');
                infoIcon.className = 'toast-info-icon';
                statusWrapper.appendChild(infoIcon);
                iconWrapper.appendChild(statusWrapper);
            } else if (type === 'loading') {
                const loader = document.createElement('div');
                loader.className = 'toast-loader';
                iconWrapper.appendChild(loader);
            }

            const messageElement = document.createElement('div');
            messageElement.className = 'toast-message';
            messageElement.textContent = message;

            if (customIcon || type === 'success' || type === 'error' || type === 'warning' || type === 'info' || type === 'loading') {
                toastElement.appendChild(iconWrapper);
            }
            toastElement.appendChild(messageElement);

            if (options && options.style) {
                toastElement.style.cssText += options.style;
            }
            if (options && options.className) {
                toastElement.className += ' ' + options.className;
            }

            // Wrapper for smooth stacking animations
            const wrapper = document.createElement('div');
            wrapper.className = 'toast-wrapper toast-wrapper-entering';
            wrapper.setAttribute('data-toast-wrapper-id', id);
            wrapper.appendChild(toastElement);
            wrapper.style.maxHeight = '0px';

            // For bottom positions, the logic is inverted to ensure "normal" order stacks from bottom up
            const shouldAppend = isTop ? this.config.reverseOrder : !this.config.reverseOrder;

            if (shouldAppend) {
                this.container.appendChild(wrapper);
            } else {
                this.container.insertBefore(wrapper, this.container.firstChild);
            }

            const toast = {
                id: id,
                element: toastElement,
                wrapper: wrapper,
                type: type,
                timeout: null,
                positionClass: positionClass,
                visible: false,
                height: 0
            };

            // Remove oldest toast when limit reached
            if (this.toasts.length >= this.config.maxToasts) {
                this.remove(this.toasts[0].id);
            }

            this.toasts.push(toast);
            toast.visible = true;
            toastElement.classList.add('show');

            const self = this;
            
            // Use ResizeObserver for dynamic height adjustment
            if (typeof ResizeObserver !== 'undefined') {
                const resizeObserver = new ResizeObserver(function(entries) {
                    if (!toast.visible) return;
                    
                    const entry = entries[0];
                    // Use offsetHeight to get the layout height, ignoring transforms (scaling)
                    const height = entry.target.offsetHeight;
                    wrapper.style.maxHeight = height + 'px';
                    wrapper.style.marginBottom = (self.config.gutter || 8) + 'px';
                });
                resizeObserver.observe(toastElement);
                toast.resizeObserver = resizeObserver;
            } else {
                setTimeout(function() {
                    // Use offsetHeight to get the layout height, ignoring transforms (scaling)
                    const actualHeight = toastElement.offsetHeight;
                    wrapper.style.maxHeight = actualHeight + 'px';
                    wrapper.style.marginBottom = (self.config.gutter || 8) + 'px';
                }, 10);
            }

            setTimeout(function() {
                wrapper.classList.remove('toast-wrapper-entering');
            }, 300);

            if (duration > 0 && type !== 'loading') {
                toast.timeout = setTimeout(function() {
                    self.remove(id);
                }, duration);
            }

            return id;
        },

        /**
         * Update an existing toast
         * @param {number} id - Toast ID
         * @param {string} message - New message
         * @param {string} type - New type
         */
        update: function(id, message, type) {
            const toast = this.toasts.find(function(t) { return t.id === id; });
            if (!toast) return;

            const messageElement = toast.element.querySelector('.toast-message');
            if (messageElement) {
                messageElement.textContent = message;
            }

            const iconWrapper = toast.element.querySelector('.toast-icon-wrapper');
            if (iconWrapper && type) {
                // Clear existing icon content
                iconWrapper.innerHTML = '';
                
                if (type === 'success') {
                    const loader = document.createElement('div');
                    loader.className = 'toast-loader';
                    iconWrapper.appendChild(loader);
                    
                    const statusWrapper = document.createElement('div');
                    statusWrapper.className = 'toast-status-wrapper';
                    const successIcon = document.createElement('div');
                    successIcon.className = 'toast-success-icon';
                    statusWrapper.appendChild(successIcon);
                    iconWrapper.appendChild(statusWrapper);
                    
                } else if (type === 'error') {
                    const loader = document.createElement('div');
                    loader.className = 'toast-loader';
                    iconWrapper.appendChild(loader);
                    
                    const statusWrapper = document.createElement('div');
                    statusWrapper.className = 'toast-status-wrapper';
                    const errorIcon = document.createElement('div');
                    errorIcon.className = 'toast-error-icon';
                    statusWrapper.appendChild(errorIcon);
                    iconWrapper.appendChild(statusWrapper);
                } else if (type === 'warning') {
                    const loader = document.createElement('div');
                    loader.className = 'toast-loader';
                    iconWrapper.appendChild(loader);
                    
                    const statusWrapper = document.createElement('div');
                    statusWrapper.className = 'toast-status-wrapper';
                    const warningIcon = document.createElement('div');
                    warningIcon.className = 'toast-warning-icon';
                    statusWrapper.appendChild(warningIcon);
                    iconWrapper.appendChild(statusWrapper);
                } else if (type === 'info') {
                    const loader = document.createElement('div');
                    loader.className = 'toast-loader';
                    iconWrapper.appendChild(loader);
                    
                    const statusWrapper = document.createElement('div');
                    statusWrapper.className = 'toast-status-wrapper';
                    const infoIcon = document.createElement('div');
                    infoIcon.className = 'toast-info-icon';
                    statusWrapper.appendChild(infoIcon);
                    iconWrapper.appendChild(statusWrapper);
                }

                // Auto dismiss updated toast
                toast.timeout = setTimeout(function() {
                    Toast.remove(id);
                }, this.config.duration);
            }
        },

        /**
         * Remove a toast notification
         * @param {number} id - Toast ID
         */
        remove: function(id) {
            const toastIndex = this.toasts.findIndex(function(t) { return t.id === id; });
            if (toastIndex === -1) return;

            const toast = this.toasts[toastIndex];
            
            if (toast.timeout) clearTimeout(toast.timeout);
            if (toast.progressInterval) clearInterval(toast.progressInterval);
            if (toast.resizeObserver) toast.resizeObserver.disconnect();

            toast.visible = false;
            toast.element.classList.remove('show');
            toast.element.classList.add('hide');

            const self = this;
            const wrapper = document.querySelector('[data-toast-wrapper-id="' + id + '"]');
            
            if (wrapper) wrapper.style.zIndex = '-1';
            
            setTimeout(function() {
                if (wrapper) {
                    wrapper.style.maxHeight = '0px';
                }
                
                setTimeout(function() {
                    if (wrapper && wrapper.parentNode) {
                        wrapper.parentNode.removeChild(wrapper);
                    }
                    const idx = self.toasts.findIndex(function(t) { return t.id === id; });
                    if (idx !== -1) {
                        self.toasts.splice(idx, 1);
                    }
                }, 300);
            }, 400);
        },

        /**
         * Remove all toast notifications
         */
        removeAll: function() {
            const currentToasts = this.toasts.slice();
            currentToasts.forEach(function(toast) {
                Toast.remove(toast.id);
            });
        }
    };

    /**
     * Public API
     */
    window.toast = function(message, options) {
        return Toast.create(message, '', options);
    };

    window.toast.success = function(message, options) {
        return Toast.create(message, 'success', options);
    };

    window.toast.error = function(message, options) {
        return Toast.create(message, 'error', options);
    };

    window.toast.warning = function(message, options) {
        return Toast.create(message, 'warning', options);
    };

    window.toast.info = function(message, options) {
        return Toast.create(message, 'info', options);
    };

    window.toast.loading = function(message, options) {
        return Toast.create(message, 'loading', options);
    };

    window.toast.promise = function(promise, messages, options) {
        const id = Toast.create(messages.loading || 'Loading...', 'loading', options);
        
        promise
            .then(function(result) {
                Toast.update(id, messages.success || 'Success!', 'success');
                return result;
            })
            .catch(function(error) {
                Toast.update(id, messages.error || 'Error!', 'error');
                throw error;
            });
        
        return promise;
    };

    window.toast.dismiss = function(id) {
        if (id !== undefined) {
            Toast.remove(id);
        } else {
            Toast.removeAll();
        }
    };

    window.toast.config = function(options) {
        Toast.configure(options);
    };
    
    console.log('Toast JS: Window.toast assigned', window.toast);

})(window);

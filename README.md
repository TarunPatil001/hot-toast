# 🔥 Hot Toast

**Smoking hot Notifications for Vanilla JavaScript.**  
Lightweight, customizable, and beautiful by default. Now featuring a stunning **Glassmorphism** design and smooth, direction-aware animations.

![Version](https://img.shields.io/badge/version-2.0.0-orange.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Size](https://img.shields.io/badge/size-~3kb-green.svg)

## ✨ Features

- 🎨 **Modern Glassmorphism UI**: Beautiful frosted glass effect with neon glows in dark mode.
- 🚀 **Smooth Animations**: Direction-aware entrance and exit animations that feel physical and responsive.
- 🌓 **Dark Mode Support**: Automatically adapts to system theme or can be toggled via CSS.
- ⚡ **Zero Dependencies**: Pure Vanilla JavaScript and CSS. No jQuery, no framework required.
- 🎯 **Flexible API**: Supports multiple argument signatures for maximum developer convenience.
- ⏳ **Promise Support**: Built-in handling for async operations (`loading` -> `success`/`error`).
- 🛠 **Manual Control**: Update existing toasts programmatically (great for progress bars or multi-step processes).

---

## 📦 Installation

Simply include the CSS and JavaScript files via CDN.

### CDN (Recommended)

Add this to your `<head>`:
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v2.0.0/lib/toast.css">
```

Add this before the closing `</body>` tag:
```html
<script src="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v2.0.0/lib/toast.js"></script>
```

---

## 🚀 Usage

### Basic Toasts

```javascript
// Simple message
toast('Hello World!');

// Success
toast.success('Successfully saved!');

// Error
toast.error('Something went wrong.');

// Warning
toast.warning('Check your input.');

// Info
toast.info('New update available.');
```

### Flexible Arguments (New in v2.0)

Hot Toast v2.0 is smart enough to understand different argument patterns:

```javascript
// 1. Message only
toast.success('Operation successful');

// 2. Message + Duration
toast.success('Operation successful', 2000);

// 3. Title + Message + Duration (The "Rich" Toast)
toast.success('Saved', 'Your changes have been saved successfully.', 4000);

// 4. Message + Options Object
toast.success('Saved', { 
    duration: 5000, 
    icon: '💾' 
});
```

### Async Operations (Promises)

Handle loading, success, and error states automatically.

```javascript
const myPromise = fetch('/api/save-data');

toast.promise(myPromise, {
    loading: 'Saving data...',
    success: 'Data saved successfully!',
    error: 'Could not save data.'
});
```

### Manual Updates

Useful for fine-grained control, like updating a loading state to success manually.

```javascript
const toastId = toast.loading('Processing...');

// ... do some work ...

// Update the existing toast
toast.update(toastId, 'Process Complete!', 'success');
```

---

## ⚙️ Configuration

You can configure the global behavior of Hot Toast.

```javascript
toast.config({
    position: 'top-right',   // 'top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right'
    duration: 4000,          // Default duration in ms
    maxToasts: 5,            // Max number of toasts visible at once
    reverseOrder: false,     // If true, new toasts appear at the bottom of the stack
    gutter: 12               // Spacing between toasts (px)
});
```

---

## 🎨 Theming & Customization

Hot Toast uses **CSS Variables**, making it incredibly easy to customize.

### Dark Mode
The library automatically detects the user's system preference. To force a theme, add `data-theme="dark"` or `data-theme="light"` to your `<html>` tag.

### Customizing Colors (CSS)
Override these variables in your own CSS to match your brand:

```css
:root {
    /* Light Mode Colors */
    --toast-bg: rgba(255, 255, 255, 0.8);
    --toast-text: #1a1a1a;
}

[data-theme="dark"] {
    /* Dark Mode Colors */
    --toast-bg: rgba(0, 0, 0, 0.8);
    --toast-text: #ffffff;
    --glow-color: #00ff9d; /* The neon glow color */
}
```

---

## 📱 Browser Support

Works in all modern browsers (Chrome, Firefox, Safari, Edge).
- Uses `requestAnimationFrame` for buttery smooth animations.
- Uses `backdrop-filter` for the glassmorphism effect (falls back gracefully on older browsers).

---

## 📄 License

MIT License © 2025 [Tarun Patil](https://github.com/TarunPatil001)

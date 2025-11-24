# 🔥 Hot Toast

A lightweight, customizable toast notification library with beautiful animations.

## Features

- 🎨 Beautiful, smooth animations
- 🔧 Fully customizable
- ✨ Zero Dependencies
- ⚡ Fast and performant
- 🎯 Promise support
- 🎭 Multiple positions
- 🔄 Stackable notifications
- ♿ Accessible

## Installation

Simply include the CSS and JavaScript files from the [GitHub repository](https://github.com/TarunPatil001/hot-toast) via jsDelivr CDN in your HTML:

```html
<!-- Add to your <head> section -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v1.1.0/lib/toast.css">

<!-- Add before closing </body> tag -->
<script src="https://cdn.jsdelivr.net/gh/TarunPatil001/hot-toast@v1.1.0/lib/toast.js"></script>
```

## Usage

### Basic Usage

```javascript
// Default toast
toast('Hello World!');

// Success toast
toast.success('Operation successful!');

// Error toast
toast.error('Something went wrong!');

// Warning toast
toast.warning('This is a warning!');

// Info toast
toast.info('Here is some information.');

// Loading toast
toast.loading('Processing...');
```

### With Custom Icon

```javascript
toast('Good Job!', { icon: '👏' });
```

### With Custom Options

```javascript
toast('Custom Toast', {
    icon: '🎉',
    duration: 5000,
    style: 'background: #333; color: #fff;',
    className: 'my-custom-class'
});
```

### Multi-line Toast

```javascript
toast('Line 1\nLine 2\nLine 3');
```

### Promise Handling

```javascript
const myPromise = fetch('/api/data');

toast.promise(myPromise, {
    loading: 'Loading...',
    success: 'Data loaded!',
    error: 'Failed to load data!'
});
```

### Dismissing Toasts

```javascript
// Dismiss a specific toast
const id = toast('Hello');
toast.dismiss(id);

// Dismiss all toasts
toast.dismiss();
```

## Configuration

Configure default settings for all toasts:

```javascript
toast.config({
    position: 'top-center',    // Position of toasts
    duration: 4000,            // Duration in milliseconds
    maxToasts: 5,              // Maximum visible toasts
    reverseOrder: false        // Stack order (false = newest on top)
});
```

### Available Positions

- `top-left`
- `top-center`
- `top-right`
- `bottom-left`
- `bottom-center`
- `bottom-right`

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `icon` | string | - | Custom emoji or icon |
| `duration` | number | 4000 | Display duration (ms), 0 = no auto-dismiss |
| `style` | string | - | Custom CSS styles |
| `className` | string | - | Additional CSS classes |

## API

### Methods

- `toast(message, options)` - Create a default toast
- `toast.success(message, options)` - Create a success toast
- `toast.error(message, options)` - Create an error toast
- `toast.loading(message, options)` - Create a loading toast
- `toast.promise(promise, messages, options)` - Handle promise states
- `toast.dismiss(id?)` - Dismiss toast(s)
- `toast.config(options)` - Update configuration

## Browser Support

Works in all modern browsers that support ES5 and CSS animations.

## License

MIT License

## Credits

Inspired by react-hot-toast

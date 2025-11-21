// Wait for toast.js to load
if (typeof toast === 'undefined') {
    console.error('Toast library not loaded!');
}

let isReversed = false;
let currentCode = '';

const codeExamples = {
    default: "toast('Hello World!');",
    success: "toast.success('Success!');",
    error: "toast.error('Error occurred!');",
    loading: "toast.loading('Loading...');",
    customIcon: "toast('Good Job!', { icon: '👏' });",
    multiline: "toast('Multi-line\\nToast\\nMessage');",
    customStyle: "toast('Custom Style', {\n  style: 'background: #333; color: #fff;'\n});",
    duration: "toast('Stays for 8 seconds', {\n  duration: 8000\n});",
    topLeft: "toast.config({ position: 'top-left' });\ntoast.success('Position: Top Left');",
    topCenter: "toast.config({ position: 'top-center' });\ntoast.success('Position: Top Center');",
    topRight: "toast.config({ position: 'top-right' });\ntoast.success('Position: Top Right');",
    bottomLeft: "toast.config({ position: 'bottom-left' });\ntoast.success('Position: Bottom Left');",
    bottomCenter: "toast.config({ position: 'bottom-center' });\ntoast.success('Position: Bottom Center');",
    bottomRight: "toast.config({ position: 'bottom-right' });\ntoast.success('Position: Bottom Right');",
    promise: "const myPromise = new Promise((resolve) => {\n  setTimeout(resolve, 2000);\n});\n\ntoast.promise(myPromise, {\n  loading: 'Loading data...',\n  success: 'Data loaded successfully!',\n  error: 'Failed to load data!'\n});",
    toggleDirection: "isReversed = !isReversed;\ntoast.config({ reverseOrder: isReversed });\ntoast.success(isReversed ? 'Reversed' : 'Normal');",
    dismiss: "toast.dismiss(); // Dismiss all toasts"
};

function highlightCode(code) {
    return code
        .replace(/\b(const|let|var|new|Promise|setTimeout|resolve)\b/g, '<span class="keyword">$1</span>')
        .replace(/\b(toast|config|success|error|loading|promise|dismiss)\b/g, '<span class="function">$1</span>')
        .replace(/'([^']*)'/g, '<span class="string">\'$1\'</span>')
        .replace(/\b(position|icon|style|duration|loading|success|error|reverseOrder)(?=:)/g, '<span class="property">$1</span>')
        .replace(/\/\/(.*)$/gm, '<span class="comment">//$1</span>');
}

function showCodeAndRun(button, type) {
    console.log('Button clicked:', type);

    // Remove active class from all buttons
    document.querySelectorAll('button').forEach(btn => btn.classList.remove('active'));
    // Add active class to clicked button
    button.classList.add('active');

    // Get and display code
    const code = codeExamples[type];
    currentCode = code;
    const codeContent = document.getElementById('codeContent');

    if (!codeContent) {
        console.error('Code content element not found!');
        return;
    }

    codeContent.innerHTML = '<pre>' + highlightCode(code) + '</pre>';

    // Execute the toast
    try {
        executeToast(type);
    } catch (error) {
        console.error('Error executing toast:', error);
    }
}

function executeToast(type) {
    if (typeof toast === 'undefined') {
        console.error('Toast is not defined!');
        alert('Toast library not loaded. Please check if toast.js is properly loaded.');
        return;
    }

    console.log('Executing toast type:', type);

    switch (type) {
        case 'default':
            toast('Hello World!');
            break;
        case 'success':
            toast.success('Success!');
            break;
        case 'error':
            toast.error('Error occurred!');
            break;
        case 'loading':
            toast.loading('Loading...');
            break;
        case 'customIcon':
            toast('Good Job!', { icon: '👏' });
            break;
        case 'multiline':
            toast('Multi-line Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.\nToast\nMessage');
            break;
        case 'customStyle':
            toast('Custom Style', { style: 'background: #333; color: #fff;' });
            break;
        case 'duration':
            toast('Stays for 8 seconds', { duration: 8000 });
            break;
        case 'topLeft':
            toast.config({ position: 'top-left' });
            toast.success('Position: Top Left');
            break;
        case 'topCenter':
            toast.config({ position: 'top-center' });
            toast.success('Position: Top Center');
            break;
        case 'topRight':
            toast.config({ position: 'top-right' });
            toast.success('Position: Top Right');
            break;
        case 'bottomLeft':
            toast.config({ position: 'bottom-left' });
            toast.success('Position: Bottom Left');
            break;
        case 'bottomCenter':
            toast.config({ position: 'bottom-center' });
            toast.success('Position: Bottom Center');
            break;
        case 'bottomRight':
            toast.config({ position: 'bottom-right' });
            toast.success('Position: Bottom Right');
            break;
        case 'promise':
            testPromise();
            break;
        case 'toggleDirection':
            toggleDirection();
            break;
        case 'dismiss':
            toast.dismiss();
            break;
    }
}

function testPromise() {
    const promise = new Promise((resolve) => {
        setTimeout(resolve, 2000);
    });

    toast.promise(promise, {
        loading: 'Loading data...',
        success: 'Data loaded successfully!',
        error: 'Failed to load data!'
    });
}

function toggleDirection() {
    isReversed = !isReversed;
    toast.config({ reverseOrder: isReversed });
    document.getElementById('directionStatus').textContent = isReversed ? 'Reversed' : 'Normal';
    toast.success(isReversed ? 'New toasts will appear at bottom' : 'New toasts will appear at top');
}

function copyCode() {
    if (!currentCode) return;
    navigator.clipboard.writeText(currentCode).then(() => {
        toast.success('Code copied!');
    });
}

// Theme handling
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.querySelector('.theme-toggle i');
    if (icon) {
        icon.className = theme === 'dark' ? 'bi bi-sun-fill' : 'bi bi-moon-stars-fill';
    }
}

// Initialize theme
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;

    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
});

// Initialize default code on page load
window.addEventListener('DOMContentLoaded', function () {
    const defaultButton = document.querySelector('button[onclick*="default"]');
    if (defaultButton) {
        defaultButton.classList.add('active');
        const code = codeExamples.default;
        currentCode = code;
        const codeContent = document.getElementById('codeContent');
        codeContent.innerHTML = '<pre>' + highlightCode(code) + '</pre>';
    }
});
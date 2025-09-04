import globals from 'globals'
import { defineConfig } from 'eslint/config'

export default defineConfig([
    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.browser, // Adds browser globals like 'window', 'document', etc.
                ...globals.jest, // Adds Jest testing globals
                ...globals.node,
                myCustomGlobal: 'readonly', // Define a custom global variable as read-only
                anotherGlobal: 'writable', // Define a custom global variable as writable
            },
        },
    },
])

# REALcam Installer

## Development
To debug, run the development server:
```bash
npm run dev
```
The application window will open, allowing you to see the result.
## Building
There are a few building options available:
```bash
# Compile Electron TypeScript code
npm run build-electron

# Export Next.js statically
npm run build-next

# Runs both build-electron and build-next
npm run build-app

# Full build and portable packaging
npm run compile 
```

To clean up things left after building and compilation, use the cleaning script:
```bash
npm run clean
```
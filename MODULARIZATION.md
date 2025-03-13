# Health Atlas Modularization

This document explains the changes made to modularize the codebase and improve the development workflow.

## Changes Made

1. **Modularized map.js**:
   - Split into separate modules for better maintainability
   - Created a clear separation of concerns
   - Made the code more testable and easier to extend

2. **Module Structure**:
   - `src/modules/constants.js`: Shared constants and configuration
   - `src/modules/map.js`: Map initialization and marker functionality
   - `src/modules/data.js`: Data loading, processing, and filtering
   - `src/modules/ui.js`: User interface components and interactions
   - `src/modules/table.js`: DataTable setup and interactions
   - `src/app.js`: Main application logic connecting all modules
   - `src/map.js`: Entry point that imports the app

3. **Build Process**:
   - Updated package.json scripts to use a single entry point
   - Maintained compatibility with the existing PHP server setup

## How to Use

### Development

1. Start the development server and build process:
   ```
   yarn run dev
   ```
   This will watch for changes in the source files and automatically rebuild.

2. In a separate terminal, start the PHP server in the public folder:
   ```
   cd public
   php -S localhost:8080
   ```

3. Open your browser and navigate to `http://localhost:8080`

4. Edit any files in the `src` directory and see changes live after the build process completes

### Production

To build for production:
```
yarn run build
```

This will create optimized, minified files in the `public/static` directory.

## Benefits of Modularization

1. **Better Organization**: Code is organized by functionality
2. **Improved Maintainability**: Smaller files are easier to understand and update
3. **Better Performance**: Only changed modules need to be rebuilt during development
4. **Clearer Dependencies**: Module imports make dependencies explicit
5. **Easier Testing**: Isolated modules are easier to test
6. **Better Collaboration**: Team members can work on different modules simultaneously

## Module Descriptions

### constants.js
Contains shared configuration and constants used across the application, such as marker settings, info box content, and data table configuration.

### map.js
Handles all map-related functionality, including initialization, marker creation, and map events.

### data.js
Manages data loading, processing, and filtering operations.

### ui.js
Handles user interface components and interactions, such as buttons, filter controls, and info boxes.

### table.js
Manages the DataTable functionality for displaying and sorting data.

### app.js
The main application logic that connects all the modules together.

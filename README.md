# Health Atlas

An interactive map visualizing healthcare integrity issues worldwide, built with Leaflet, jQuery, and modern JavaScript.

## Project Structure

The project has been modularized for better maintainability:

```
atlas_clean/
├── public/              # Public files served by the web server
├── src/                 # Source code
│   ├── js/              # JavaScript modules
│   │   ├── components/  # UI and functional components
│   │   ├── utils/       # Utility functions
│   │   └── app.js       # Main application
│   ├── index.js         # Entry point
├── package.json         # Project configuration
└── README.md            # This file
```

### Key Components

- **map-config.js**: Initializes and configures the Leaflet map
- **data-table.js**: Handles the data table functionality
- **filters.js**: Manages all filter-related operations
- **markers.js**: Handles map marker creation and updates
- **ui.js**: Manages UI interactions not related to the map
- **data-loader.js**: Handles data fetching and processing
- **app.js**: Coordinates all components and manages application state

## Setup

1. Install Parcel web application bundler globally:
```
yarn global add parcel-bundler
```

2. Install dependencies:
```
yarn install
```

## Development

Start the development server:
```
yarn run dev
```

Run local PHP server in public folder:
```
php -S localhost:8080
```

## Production

Build for production:
```
yarn run build
```

## How It Works

1. The application loads data from `./data/loc3.json`.
2. It initializes the map, data table, and filters.
3. Users can filter data by country, corruption category, health category, date, and other criteria.
4. The map and data table update dynamically as filters are applied.
5. Users can switch between map and list views.

## Adding New Features

To add new features:

1. Create a new component in the appropriate directory
2. Import it in app.js
3. Integrate it with the application state

## Debugging

Check the browser console for timing information and logs. Key metrics are logged for:

- Data fetching
- Data processing
- Filtering
- Map updates
- Data table updates

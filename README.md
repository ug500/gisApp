This project is a web-based GIS application that allows users to view and interact with geographic data, specifically focusing on displaying community resources on an interactive map. Users can browse different types of resources and potentially search by location or category.

## Technologies Used


- React
- React Leaflet
- Axios
- Node.js
- Express
- MongoDB
- Leaflet CSS

**Spatial data is stored using the GeoJSON format within the MongoDB database.**

## Setup Instructions



1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd gis-app
    ```
    *(Replace `<repository-url>` with the actual URL of your GitHub repository)*

2.  **Install backend dependencies:**
    ```bash
    cd server
    npm install  # or yarn install
    ```

3.  **Configure backend environment variables:**
    * Create a `.env` file in the `server` directory (if you have environment variables).
    * Add your MongoDB connection string and any other necessary secrets.
    ```
    MONGODB_URI=your_mongodb_connection_string
    # Other variables if needed
    ```

4.  **Start the backend server:**
    ```bash
    npm start  # or yarn start
    ```
    *(Note the script defined in your `server/package.json`)*

5.  **Install frontend dependencies:**
    ```bash
    cd ../client
    npm install  # or yarn install
    ```

6.  **Configure frontend environment variables:**
    * Create a `.env` file in the `client` directory (if you have environment variables).
    * Add any frontend-specific configurations.
    ```
    # Example: API_BASE_URL=http://localhost:9000
    ```

7.  **Start the frontend development server:**
    ```bash
    npm start  # or yarn start
    ```
    *(Note the script defined in your `client/package.json`)*

8.  **Open your browser and navigate to** `http://localhost:3000` (or the port your frontend server runs on).

## Usage


> Once the application is running, you will see an interactive map displaying various resource markers. You can click on a marker to view more details about the resource in a popup.

## Further Development



## Contributing



## License







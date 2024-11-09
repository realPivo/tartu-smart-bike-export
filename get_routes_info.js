async function fetchBikeRoutes(routeIds, token) {
  const baseUrl =
    'https://serverapp.ratas.tartu.ee/api/users/get-ride-locations/';
  const results = {
    routes: [],
  };

  try {
    // Fetch data for each route ID
    const routePromises = routeIds.map(async (routeId) => {
      try {
        const response = await fetch(baseUrl + routeId, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json, text/plain, */*',
            'Be-Token': `${token}`, // Use the provided token here
          },
        });

        if (!response.ok) {
          console.warn(
            `Failed to fetch route ${routeId}: HTTP ${response.status}`
          );
          results.failedRoutes++;
          return null;
        }

        const data = await response.json();
        if (data && data.route) {
          return data.route;
        } else {
          console.warn(`Invalid data format for route ${routeId}`);
          results.failedRoutes++;
          return null;
        }
      } catch (error) {
        console.warn(`Error fetching route ${routeId}:`, error);
        return null;
      }
    });

    // Wait for all requests to complete
    const routeResults = await Promise.all(routePromises);
    results.routes = routeResults.filter((route) => route !== null);

    // Create a download link for the JSON file
    const blob = new Blob([JSON.stringify(results, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `bike-routes-${
      new Date().toISOString().split('T')[0]
    }.json`;

    // Trigger download
    downloadLink.click();

    // Cleanup
    URL.revokeObjectURL(url);

    return results;
  } catch (error) {
    console.error('Error in fetchBikeRoutes:', error);
    throw error;
  }
}

// Replace with your actual Be-Token from frontend request header
const token = '########-####-####-####-############';

// Generate route IDs from routes_map.ipynb and paste here
const routeIds = [
  'route_01_2024@########-####-####-####-############',
  'another_route@########-####-####-####-############',
];

fetchBikeRoutes(routeIds, token)
  .then((results) => console.log('Fetched data:', results))
  .catch((error) => console.error('Error:', error));

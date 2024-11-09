function generateMonthBatches(date, numMonths) {
  // Parse the input date
  const currentDate = new Date(date);

  // Validate input date
  if (isNaN(currentDate.getTime())) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD');
  }

  // Array to store the date ranges
  const batches = [];

  // Helper function to format date to YYYY-MM-DD
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate batches for each month
  for (let i = 0; i < numMonths; i++) {
    // Calculate end date (last day of the month)
    const endDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    // Calculate start date (first day of the month)
    const startDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );

    // Add the batch to the array
    batches.push({
      start: formatDate(startDate),
      end: formatDate(endDate),
    });

    // Move to the previous month
    currentDate.setMonth(currentDate.getMonth() - 1);
  }

  return batches;
}

function fetchUserRides(token, fromDateStr, toDateStr) {
  return new Promise((resolve, reject) => {
    // Convert the date strings to timestamps
    const fromDate = new Date(fromDateStr).getTime();
    const toDate = new Date(toDateStr).getTime();

    // Check if the dates are valid
    if (isNaN(fromDate) || isNaN(toDate)) {
      reject("Invalid date format. Please use 'YYYY-MM-DD'.");
      return;
    }

    // Fetch the rides data from the server
    fetch('https://serverapp.ratas.tartu.ee/api/users/get-user-rides', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
        'Be-Token': `${token}`, // Use the provided token here
      },
      body: JSON.stringify({
        endStation: '',
        fromDate: fromDate, // Use the provided fromTime
        startStation: '',
        toDate: toDate, // Use the provided toTime
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        resolve(data); // Resolve with the fetched data
      })
      .catch((error) => {
        reject(`Error: ${error.message}`); // Reject with the error message
      });
  });
}

async function fetchAllRides(startDate, numMonths, token) {
  const batches = generateMonthBatches(startDate, numMonths);
  const allRides = [];

  for (const batch of batches) {
    const { start, end } = batch;
    console.log(`Processing batch from ${start} to ${end}`);

    // Add delay between requests
    await new Promise((resolve) => setTimeout(resolve, 1000)); // 1 second delay

    const rides = await fetchUserRides(token, start, end);
    allRides.push(rides);
  }

  return allRides;
}

// Function to convert the allRides array to CSV
function convertToCSV(allRides) {
  let csv =
    'id,length,duration,start_station,end_station,costs,cycle,start,end\n'; // CSV header

  // Loop through each ride
  allRides.forEach((ride) => {
    ride.routes.forEach((route) => {
      // Extract values for each route
      let id = route.id || '';
      let length = route.length || '';
      let duration = route.duration || '';
      let start_station = route.start_station || '';
      let end_station = route.end_station || '';
      let costs = route.costs || '';
      let cycle = route.cycle || '';
      let start = route.start || '';
      let end = route.end || '';

      // Add the values as a new row in the CSV
      csv += `${id},${length},${duration},${start_station},${end_station},${costs},${cycle},${start},${end}\n`;
    });
  });

  return csv;
}

const endDate = 'YYYY-MM-DD'; // Replace with endDate (today for example)
const numMonths = 1; // Number of months (back in time) to fetch data for

// Replace with your actual Be-Token from frontend request header
const token = '########-####-####-####-############';

const allRides = await fetchAllRides(endDate, numMonths, token);

// Convert allRides to CSV
let csvData = convertToCSV(allRides);

// Print CSV to console
console.log(csvData);

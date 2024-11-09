# Rides export and map plotting from Tartu Smart Bike

## Story

[Tartu Smart Bike Share](https://tartu.ee/en/bike-share) is a public, self-service bike share system for short trips. Tartu unveiled its bike share system on June 8, 2019. As of 2024, bike network comprises 750+ bikes and 100 stations. Two thirds of the fleet is equipped with electric-assist motors that provide riders with an extra boost when pedalling.

## Project

This repository contains a small collection of scripts for exporting your rides and route plotting from the frontend part of the [Tartu Smart Bike system](https://ratas.tartu.ee/).

## Usage

1. Copy the code from `get_rides_list.js` into your browser's Console (Developer Tools).
2. Set endDate to your preferred date (e.g., today).
3. Update the `token` variable:

   - In DevTools, go to the **Network** tab and find recent requests (e.g., `user-profile` or `get-user-rides`).
   - Copy the `Be-Token` value from one of these requests.

4. Run the script with **Enter** and download the generated .csv file.
5. Use `format_ids_for_js()` in `routes_map.ipynb` to format route IDs as:

   ```javascript
   const routeIds = [
     'route_01_2024@########-####-####-####-############',
     ...
   ];
   ```

   to paste into `get_routes_info.js`.

6. Paste same token to `get_routes_info.js` too.
7. Run `get_routes_info.js` in the Console by pressing **Enter**.
8. Set the downloaded .json file path in `routes_map.ipynb` to generate `routes_map.html`.

## Map example
https://github.com/user-attachments/assets/91fc7e4a-a8ee-497c-8229-45e545aed2e3

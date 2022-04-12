# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm install`, then `npm client`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

Link to deployed version of app:
https://copilot-app.herokuapp.com/

I started out building out the UI and didn't have time to implement an actual API. We are grabbing data from csv files.

The logic for what would happen behind the scenes in an API is handled within React in src\Components\Table\helpers.jsx,
src\api\index.js, and lines 37-47 in src\pages\UserPage.jsx

The API endpoint responses have been displayed in the UI in the src\Components\Table\Table.jsx component

There is lots of potential to improve the functionality and UI, it is a very bare bones version of a social media site.

Data from:
https://github.com/mathbeveridge/asoiaf

Data structures from:
https://github.com/amejiarosario/dsa.js-data-structures-algorithms-javascript
# Database Project: Ethereum Blockchain Scanner

This project is a simple blockchain scanner on the Ethereum blockchain. It provides a user-friendly interface for blockchain users, investors, developers, and regulators to analyze data and track activities. Check it out [here](https://blockchain-scanner.netlify.app)!

## Getting Started
This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.
### Installation
1. Clone the repo
   ```sh
   git clone https://github.com/jchen324/blockchain-scanner.git
   ```
2. Navigate to the frontend directory
   ```sh
   cd frontend
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Enter Supabase url and key in `.env.local`
   ```js
   NEXT_PUBLIC_SUPABASE_URL='ENTER YOUR SUPABASE URL'
   NEXT_PUBLIC_SUPABASE_ANON_KEY='ENTER YOUR SUPABASE KEY'
   ```

## How We Loaded the Data
To access the data stored on a blockchain network, we can run our own blockchain node or use the services of a company like Infura, which provides an API for accessing the node they run. We have written a JavaScript script that utilizes the Infura API and the web3.js library to retrieve data from the Ethereum blockchain and insert them into a SQL database. We only retrieve data within a certain blockID range due to the large volume of data on the Ethereum blockchain. Batch data insertion is enabled in insert_data.js.

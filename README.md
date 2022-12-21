# Database Project: Ethereum Blockchain Scanner

This project is a simple blockchain scanner on the Ethereum blockchain. It provides a user-friendly interface for blockchain users, investors, developers, and regulators to analyze data and track activities. Check it out [here](https://blockchain-scanner.netlify.app)!

## Check out the demo first!

[https://blockchain-db.netlify.app/](https://blockchain-db.netlify.app/)

### User Guide

To navigate through our web application: the user can click on the cards on the home page, each leading to a page presenting a table of relevant data.

<img src="/images/nav.png" alt="Drawing" width="600"/>

The user can click on the attributes of each table to sort the rows based on each attribute.

<img src="/images/sort.png" alt="Drawing" width="200"/>

Then for each primary key and foreign key, the user can click on the hyperlink to see the details of that tuple as well.

Alternatively, the user can choose to directly input transaction hash, wallet address, or blockID in the search bar at home page to see the details.

<img src="/images/search.png" alt="Drawing" width="600"/>

The application also provides an advanced GUI aided with data visualization for data analysis.

<img src="/images/data.png" alt="Drawing" width="600"/>

## Getting Started

This is an example of how you may give instructions on setting up your project locally. To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/gillKSC/blockchain-scanner.git
   ```
2. Navigate to the frontend directory
   ```sh
   cd frontend
   ```
3. Install NPM packages
   ```sh
   npm install
   ```

### Configuring Supabase

1. Create an empty database on Supabase

2. Copy and paste the code from `create_table.sql` to the SQL editor on Supabase and run, now the schema is imported

The schema is designed as follows:

ER aiagram

<img src="/images/er.png" alt="Drawing" width="400"/>
Relational table

<img src="/images/table.png" alt="Drawing" width="400"/>

See `create_table.sql for relational table specification.

3. Enter Supabase url and key in `frontend/.env.local`
   ```js
   NEXT_PUBLIC_SUPABASE_URL = 'ENTER YOUR SUPABASE URL';
   NEXT_PUBLIC_SUPABASE_ANON_KEY = 'ENTER YOUR SUPABASE KEY';
   ```

### Loading the Data

To access the data stored on a blockchain network, we can run our own blockchain node or use the services of a company like Infura, which provides an API for accessing the node they run. We have written a JavaScript script that utilizes the Infura API and the web3.js library to retrieve data from the Ethereum blockchain and insert them into a SQL database. Batch data insertion is enabled in insert_data.js.

1. Enter Supabase url and key in `./.env.local`
   ```js
   NODE_PROVIDER = 'ENTER YOUR WEB3 API HERE';
   DATABASE = 'ENTER YOUR SUPABASE URL';
   KEY = 'ENTER YOUR SUPABASE KEY';
   ```
2. Run `insert_data.js`

```sh
   node insert_data.js
```

Now check the tables in Supabase, it should have data inserted now.

### Run the application locally

1. Navigate to the frontend directory
   ```sh
   cd frontend
   ```
2. Run the app
   ```sh
   npm run dev
   ```
3. Go to `http://localhost:3000/` on your browser

const express = require('express');
const app = express();
const port = 3000;
const Web3 = require('web3');
const web3 = new Web3(
  'https://mainnet.infura.io/v3/6c45c5cbea0745da847693814b280766'
);
const fs = require('fs');
// get the client
const mysql = require('mysql2');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://viqaqlyfbhvqerbkpedh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcWFxbHlmYmh2cWVyYmtwZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0MDE4MTQsImV4cCI6MTk4Njk3NzgxNH0.N73T29e-2Dg50oDxXSYgeHfKsTzlXlF7Uu8AGUU1ZZ0'
);

const filePath = './hello.txt';
const data = 'Hello world';

// create the pool
const pool = mysql.createPool({
  host: 'dbase.cs.jhu.edu',
  user: '',
  password: '',
  database: '',
});
// now get a Promise wrapped instance of that pool
const promisePool = pool.promise();

async function getBlockchainInfo() {
  try {
    // Get the latest block number
    const latestBlockNumber = await web3.eth.getBlockNumber();

    // Get the latest block
    const latestBlock = await web3.eth.getBlock(latestBlockNumber);

    const blockID = latestBlock.number;
    const timestamp = latestBlock.timestamp;
    const gasUsed = latestBlock.gasUsed;
    const baseFeePerGas = latestBlock.baseFeePerGas; // in Wei
    const blockReward = (baseFeePerGas / Math.pow(10, 18)) * gasUsed; // in Ether
    const minerAddress = latestBlock.miner;

    let minerBalance = await web3.eth.getBalance(minerAddress); // a String in Wei

    // Convert to Ether
    minerBalance = Number(minerBalance) / Math.pow(10, 18);

    // const parentBlock = await web3.eth.getBlock(latestBlock.parentHash);
    // const parentID = parentBlock.number;
    const parentID = blockID === 0 ? null : blockID - 1;

    // console.log(blockID);
    // console.log(timestamp);
    // console.log(blockReward);
    // console.log(minerAddress);

    writeData(`blockID: ${blockID} \n`);
    writeData(`timestamp: ${timestamp} \n`);
    writeData(`blockReward: ${blockReward} \n`);
    writeData(`minerAddress: ${minerAddress} \n`);
    writeData(`parentID: ${parentID} \n\n`);

    await promisePool.query(
      'INSERT INTO Wallet (balance, address) VALUES (?, ?)',
      [minerBalance, minerAddress]
    );
    await promisePool.query(
      'INSERT INTO Block (blockID, timeStamp, blockReward, minerAddress) VALUES (?, ?, ?, ?)',
      [blockID, timestamp, blockReward, minerAddress]
    );

    const transactions = latestBlock.transactions;
    transactions.forEach((transactionHash) =>
      getTransactionInfo(transactionHash)
    );
  } catch (error) {
    console.error(error);
  }
}

async function getTransactionInfo(transactionHash) {
  try {
    // Get the transaction object
    const transaction = await web3.eth.getTransaction(transactionHash);
    const transactionReceipt = await web3.eth.getTransactionReceipt(
      transactionHash
    );
    let status = transactionReceipt.status;
    if (transactionReceipt != null) {
      status = status ? 'Success' : 'Failed';
    } else {
      status = 'Receipt not found';
    }
    const from = transaction.from;
    const to = transaction.to;
    const value = transaction.value / Math.pow(10, 18); // in Ether
    const gasUsed = transactionReceipt.gasUsed;
    const gasPrice = transaction.gasPrice; // in Wei
    const transactionFee = (gasPrice / Math.pow(10, 18)) * gasUsed; // in Ether
    const blockID = transaction.blockNumber;

    let fromBalance = await web3.eth.getBalance(from); // a String in Wei
    fromBalance = Number(fromBalance) / Math.pow(10, 18);
    const { data: fromWallet } = await supabase
      .from('wallet')
      .upsert({ balance: fromBalance, address: from });
    if (to != null) {
      let toBalance = await web3.eth.getBalance(to);
      toBalance = Number(toBalance) / Math.pow(10, 18);
      const { data: toWallet } = await supabase
        .from('wallet')
        .upsert({ balance: toBalance, address: to });
    }

    // Convert status

    // console.log(transactionHash);
    // console.log(value);
    // console.log(from);
    // console.log(to);
    // console.log(transactionFee);
    // console.log(gasUsed);
    // console.log(blockID);

    const { data: transactions } = await supabase.from('transaction').upsert({
      transactionhash: transactionHash,
      value: value,
      transactionfee: transactionFee,
      status: status,
      gasused: gasUsed,
      blockid: blockID,
    });

    const { data: parties } = await supabase
      .from('transaction_parties')
      .upsert({
        transactionhash: transactionHash,
        fromaddress: from,
        toaddress: to,
      });

    // writeData(`transactionHash: ${transactionHash} \n`);
    // writeData(`value: ${value} \n`);
    // writeData(`from: ${from} \n`);
    // writeData(`fromBalance: ${fromBalance} \n`);
    // writeData(`to: ${to} \n`);
    // writeData(`toBalance: ${toBalance} \n`);
    // writeData(`transactionFee: ${transactionFee} \n`);
    // writeData(`gasUsed: ${gasUsed} \n`);
    // writeData(`blockID: ${blockID} \n`);
    // writeData(`status: ${status} \n\n`);
  } catch (error) {
    console.error(error);
  }
}

async function writeData(data) {
  fs.appendFileSync(filePath, data, (error) => {
    if (error) {
      console.error(error);
    } else {
      console.log(`Data saved to file: ${filePath}`);
    }
  });
}

async function test() {
  try {
    const latestBlockNumber = (await web3.eth.getBlockNumber()) - 1000;
    for (let i = 0; i < 100; i++) {
      // Get the latest block
      const latestBlock = await web3.eth.getBlock(latestBlockNumber + i);

      const blockID = latestBlock.number;
      console.log(blockID);
      const timestamp = latestBlock.timestamp;
      const gasUsed = latestBlock.gasUsed;
      const baseFeePerGas = latestBlock.baseFeePerGas; // in Wei
      const blockReward = (baseFeePerGas / Math.pow(10, 18)) * gasUsed; // in Ether
      const minerAddress = latestBlock.miner;

      let minerBalance = await web3.eth.getBalance(minerAddress); // a String in Wei

      // Convert to Ether
      minerBalance = Number(minerBalance) / Math.pow(10, 18);

      // const parentBlock = await web3.eth.getBlock(latestBlock.parentHash);
      // const parentID = parentBlock.number;
      const parentID = blockID === 0 ? null : blockID - 1;

      // console.log(blockID);
      // console.log(timestamp);
      // console.log(blockReward);
      // console.log(minerAddress);

      writeData(`blockID: ${blockID} \n`);
      writeData(`timestamp: ${timestamp} \n`);
      writeData(`blockReward: ${blockReward} \n`);
      writeData(`minerAddress: ${minerAddress} \n`);
      writeData(`parentID: ${parentID} \n\n`);

      console.log(timestamp);

      const { data: wallet } = await supabase
        .from('wallet')
        .upsert({ balance: minerBalance, address: minerAddress });

      const { data: block, error } = await supabase.from('block').upsert({
        blockid: blockID,
        timestamp: timestamp,
        blockreward: blockReward,
        mineraddress: minerAddress,
      });

      const { data: block_parent } = await supabase
        .from('block_parent')
        .upsert({ childblock: blockID, parentblock: parentID });

      // Insert a row
      console.log(block, error);
      const transactions = latestBlock.transactions;
      for (const transactionHash of transactions) {
        console.log(transactionHash);
        getTransactionInfo(transactionHash);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

// getTransactionInfo("0xfb16f2cf8bfcb1b2fa6058f6e027f20ba9d8cd0063743aa5a6e8f785c8468d8d");
test();
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

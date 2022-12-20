require('dotenv').config();
const Web3 = require('web3');
const web3 = new Web3(process.env.NODE_PROVIDER);
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.DATABASE, process.env.KEY);

async function getData() {
  try {
    // get data within a range of blocks
    const startingBlock = (await web3.eth.getBlockNumber()) - 1000;
    for (let i = 0; i < 100; i++) {
      const latestBlock = await web3.eth.getBlock(startingBlock + i);
      const blockID = latestBlock.number;
      const timestamp = latestBlock.timestamp;
      const gasUsed = latestBlock.gasUsed;
      const baseFeePerGas = latestBlock.baseFeePerGas; // in Wei
      const blockReward = (baseFeePerGas / Math.pow(10, 18)) * gasUsed; // in Ether
      const minerAddress = latestBlock.miner;
      let minerBalance = await web3.eth.getBalance(minerAddress); // a String in Wei
      minerBalance = Number(minerBalance) / Math.pow(10, 18); // Convert to Ether
      const parentID = blockID === 0 ? null : blockID - 1;

      // insert wallet data into database
      const { data: wallet } = await supabase
        .from('wallet')
        .upsert({ balance: minerBalance, address: minerAddress });

      // insert block data into database
      const { data: block, error } = await supabase.from('block').upsert({
        blockid: blockID,
        timestamp: timestamp,
        blockreward: blockReward,
        mineraddress: minerAddress,
      });

      // insert block_parent data into database
      const { data: block_parent } = await supabase
        .from('block_parent')
        .upsert({ childblock: blockID, parentblock: parentID });

      // insert data of all transactions in the block to database
      const transactions = latestBlock.transactions;
      for (const transactionHash of transactions) {
        getTransactionInfo(transactionHash);
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function getTransactionInfo(transactionHash) {
  try {
    // get data associated with the transactionHash
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

    // insert from and to to database
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

    // insert transaction to database
    const { data: transactions } = await supabase.from('transaction').upsert({
      transactionhash: transactionHash,
      value: value,
      transactionfee: transactionFee,
      status: status,
      gasused: gasUsed,
      blockid: blockID,
    });

    // insert transaction_parties to database
    const { data: parties } = await supabase
      .from('transaction_parties')
      .upsert({
        transactionhash: transactionHash,
        fromaddress: from,
        toaddress: to,
      });
  } catch (error) {
    console.error(error);
  }
}

getData();

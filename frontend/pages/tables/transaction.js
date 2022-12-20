import Link from 'next/link';
import { useState, useEffect } from 'react';
import supabase from '../../utils/supabase';
import styles from '../../styles/Home.module.css';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Transaction({ data }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className='container flex justify-center'>
          <h1>Transactions</h1>
        </div>
        <div className='container flex justify-center'>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size='small'
              aria-label='a dense table'
            >
              <TableHead>
                <TableRow>
                  <TableCell>Transaction Hash</TableCell>
                  <TableCell align='right'>Transaction Fee</TableCell>
                  <TableCell align='right'>Status</TableCell>
                  <TableCell align='right'>Gas</TableCell>
                  <TableCell align='right'>Block</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((Transaction) => (
                  <TableRow
                    key={Transaction.transactionhash}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      <Link
                        className={styles.Link}
                        href={`/transaction/${Transaction.transactionhash}`}
                      >
                        {Transaction.transactionhash}
                      </Link>
                    </TableCell>
                    <TableCell align='right'>
                      {Transaction.transactionfee}
                    </TableCell>
                    <TableCell align='right'>{Transaction.status}</TableCell>
                    <TableCell align='right'>{Transaction.gasused}</TableCell>
                    <TableCell align='right'>
                      <Link
                        className={styles.Link}
                        href={`/block/${Transaction.blockid}`}
                      >
                        {Transaction.blockid}
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* {data.map((Transaction) => {
          return (
            <h3 key={Transaction.transactionhash}>
              <Link href={`/transaction/${Transaction.transactionhash}`}>
                Transaction Hash: {Transaction.transactionhash},
              </Link>
              Transaction Fee: {Transaction.transactionfee}, Status:
              {Transaction.status}, Gas: {Transaction.gasused},
              {Transaction.blockid}
            </h3>
          );
        })} */}
      </main>
    </div>
  );
}

export default Transaction;

export async function getServerSideProps() {
  const { data, error } = await supabase.from('transaction').select('*');

  return {
    props: {
      data: data,
    },
  };
}

import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import supabase from '../../utils/supabase';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function Wallet({ data }) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <div className='container flex justify-center'>
          <h1>Wallets</h1>
        </div>

        {/* {data.map((Wallet) => {
        return (
          <h3 key={Wallet.address}>
            <Link href={`/wallet/${Wallet.address}`}>
              Address: {Wallet.address}, Balance: {Wallet.balance}
            </Link>
          </h3>
        );
      })} */}
        <div className='container flex justify-center'>
          <TableContainer component={Paper}>
            <Table
              sx={{ minWidth: 650 }}
              size='small'
              aria-label='a dense table'
            >
              <TableHead>
                <TableRow>
                  <TableCell>Address</TableCell>
                  <TableCell align='right'>Balance</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((Wallet) => (
                  <TableRow
                    key={Wallet.address}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell component='th' scope='row'>
                      <Link
                        className={styles.Link}
                        href={`/wallet/${Wallet.address}`}
                      >
                        {Wallet.address}
                      </Link>
                    </TableCell>
                    <TableCell align='right'>{Wallet.balance}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </div>
  );
}

export default Wallet;

export async function getServerSideProps() {
  const { data, error } = await supabase.from('wallet').select('*');

  return {
    props: {
      data: data,
    },
  };
}

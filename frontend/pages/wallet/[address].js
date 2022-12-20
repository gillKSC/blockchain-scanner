import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from '../../styles/Home.module.css';
import supabase from '../../utils/supabase';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const walletDetails = ({ data, history }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <p className={styles.tuple}>Wallet Details</p>
        <Box sx={{ width: 600, height: 100 }}>
          <Grid container spacing={2} columns={16}>
            <Grid xs={16}>
              <Item>
                <b>Address:</b> {data.address}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Balance:</b> {data.balance}
              </Item>
            </Grid>
          </Grid>
        </Box>

        {/* {history.map((Transaction) => {
          return (
            <h4 key={Transaction.transactionhash}>
              <p>
                <Link href={`/transaction/${Transaction.transactionhash}`}>
                  Transaction Hash: {Transaction.transactionhash},
                </Link>
              </p>
              <p> Transaction Fee: {Transaction.transactionfee}</p>
              <p> Status: {Transaction.status}</p>
              <p> Gas: {Transaction.gasused}</p>
              <p> Block: {Transaction.blockid}</p>
            </h4>
          );
        })} */}
        <p className={styles.tuple}>Transaction History</p>
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
                {history.map((Transaction) => (
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
                    <TableCell align='right'>{Transaction.blockid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </main>
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data, error } = await supabase.from('wallet').select('address');

  const paths = data.map(({ address }) => ({
    params: {
      address: address.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { address } }) => {
  const { data: wallet } = await supabase
    .from('wallet')
    .select('*')
    .eq('address', address)
    .single();
  const { data: history } = await supabase
    .from('transaction')
    .select('*, transaction_parties(*)')
    .eq('transaction_parties.fromaddress', address);
  return {
    props: {
      data: wallet,
      history: history,
    },
  };
};

export default walletDetails;

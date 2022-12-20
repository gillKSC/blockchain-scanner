import Link from 'next/link';
import * as React from 'react';
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
import Button from '@mui/material/Button';

const MyButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Home
    </a>
  );
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const walletDetails = ({ data, from, to }) => {
  return (
    <div className={styles.container}>
      <div className={styles.nav}>
        <Box sx={{ pt: 4 }}>
          <Button variant='contained'>
            <Link href='/' passHref legacyBehavior>
              <MyButton />
            </Link>
          </Button>
        </Box>
      </div>
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
        <Box sx={{ pt: 4 }}>
          <p>
            <b>Transactions History:</b> {from.length + to.length} in total
          </p>
        </Box>
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
                  <TableCell align='right'>Value</TableCell>
                  <TableCell align='right'>Status</TableCell>
                  <TableCell align='right'>Gas</TableCell>
                  <TableCell align='right'>Block</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {from.map((Transaction) => (
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
                    <TableCell align='right'>{Transaction.value}</TableCell>
                    <TableCell align='right'>{Transaction.status}</TableCell>
                    <TableCell align='right'>{Transaction.gasused}</TableCell>
                    <TableCell align='right'>{Transaction.blockid}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableBody>
                {to.map((Transaction) => (
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
                    <TableCell align='right'>{Transaction.value}</TableCell>
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
  const { data: from } = await supabase
    .from('transaction_history')
    .select('*')
    .eq('fromaddress', address);
  const { data: to } = await supabase
    .from('transaction_history')
    .select('*')
    .eq('toaddress', address);

  return {
    props: {
      data: wallet,
      from: from,
      to: to,
    },
  };
};

export default walletDetails;

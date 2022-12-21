import supabase from '../../utils/supabase';
import Link from 'next/link';
import * as React from 'react';
import styles from '../../styles/Home.module.css';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const MyButton = React.forwardRef(({ onClick, href }, ref) => {
  return (
    <a href={href} onClick={onClick} ref={ref}>
      Home
    </a>
  );
});

MyButton.displayName = 'MyButton';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const transactionDetails = ({ data, parties }) => {
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
        <div className='container flex justify-center'>
          <h1>Transaction Details</h1>
        </div>

        <Box sx={{ width: 600, height: 100 }}>
          <Grid container spacing={2} columns={16}>
            <Grid xs={16}>
              <Item>
                <b>Hash:</b> {data.transactionhash}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Value:</b> {data.value}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Transaction Fee:</b> {data.transactionfee}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Status:</b> {data.status}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Gas:</b> {data.gasused}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Block:</b>{' '}
                <Link href={`/block/${data.blockid}`}>
                  <u>{data.blockid}</u>
                </Link>
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>From: </b>
                <Link href={`/wallet/${parties.fromaddress}`}>
                  <u>{parties.fromaddress}</u>
                </Link>
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>To: </b>
                <Link href={`/wallet/${parties.toaddress}`}>
                  <u>{parties.toaddress}</u>
                </Link>
              </Item>
            </Grid>
          </Grid>
        </Box>
      </main>
    </div>
  );
};

transactionDetails.displayName = 'transactionDetails';

export default transactionDetails;

export const getStaticPaths = async () => {
  const { data, error } = await supabase
    .from('transaction')
    .select('transactionhash');

  const paths = data.map(({ transactionhash }) => ({
    params: {
      id: transactionhash.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const { data: transaction, error } = await supabase
    .from('transaction')
    .select('*')
    .eq('transactionhash', id)
    .single();

  const { data: parties } = await supabase
    .from('transaction_parties')
    .select('*')
    .eq('transactionhash', id)
    .single();

  return {
    props: {
      data: transaction,
      parties: parties,
    },
  };
};

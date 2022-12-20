import supabase from '../../utils/supabase';
import Link from 'next/link';
import styles from '../../styles/Home.module.css';
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

function date(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000);
  let day = date.toLocaleDateString('en-US').toString();
  let time = date.toLocaleTimeString('en-US').toString();
  return day.concat(' ', time);
}

const blockDetails = ({ data, transactions, parent, time }) => {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <p className={styles.tuple}>Block Details</p>
        <Box sx={{ width: 600, height: 230 }}>
          <Grid container spacing={2} columns={16}>
            <Grid xs={16}>
              <Item>
                <b>Block ID:</b> {data.blockid}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Timestamp:</b> {time}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <b>Reward:</b> {data.blockreward}
              </Item>
            </Grid>
            <Grid xs={16}>
              <Item>
                <Link href={`/wallet/${data.mineraddress}`}>
                  <b>Miner:</b> <u>{data.mineraddress}</u>
                </Link>
              </Item>
            </Grid>
            {parent != null && (
              <Grid xs={16}>
                <Item>
                  <Link href={`/block/${parent.parentblock}`}>
                    <b>Parent:</b> <u>{parent.parentblock}</u>
                  </Link>
                </Item>
              </Grid>
            )}
          </Grid>
        </Box>
        <p className={styles.tuple}>Transactions Contained</p>
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
                </TableRow>
              </TableHead>
              <TableBody>
                {transactions.map((Transaction) => (
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {/* <div>
          <h1>{data.blockid}</h1>
          <p>
            Timestamp: {data.timestamp}, Reward: {data.blockreward},
            <Link href={`/wallet/${data.mineraddress}`}>
              Miner: {data.mineraddress}
            </Link>
          </p>
        </div>
        {transactions.map((Transaction) => {
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
      </main>
    </div>
  );
};

export const getStaticPaths = async () => {
  const { data, error } = await supabase.from('block').select('blockid');

  const paths = data.map(({ blockid }) => ({
    params: {
      id: blockid.toString(),
    },
  }));

  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params: { id } }) => {
  const { data: block } = await supabase
    .from('block')
    .select('*')
    .eq('blockid', id)
    .single();
  const { data: parent } = await supabase
    .from('block_parent')
    .select('*')
    .eq('childblock', id)
    .single();
  const { data: transactions } = await supabase
    .from('transaction')
    .select('*')
    .eq('blockid', id);
  return {
    props: {
      data: block,
      transactions: transactions,
      parent: parent,
      time: date(block.timestamp),
    },
  };
};

export default blockDetails;

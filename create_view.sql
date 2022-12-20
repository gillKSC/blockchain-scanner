DROP view IF EXISTS transaction_history;
create view transaction_history as
  select
    transaction.transactionhash,
    transaction.value,
    transaction.transactionfee,
    transaction.status,
    transaction.gasused,
    transaction.blockid,
    transaction_parties.fromaddress,
    transaction_parties.toaddress
  from transaction
  inner join transaction_parties on transaction_parties.transactionhash = transaction.transactionhash;

DROP view IF EXISTS wallet_freq;
create view wallet_freq as
  select case 
        when wallet.balance = 0.0 then '0'
        when wallet.balance <= 0.001 then '0-0.001'
        when wallet.balance <= 0.01 then '0.001-0.01'
        when wallet.balance <= 0.1 then '0.01-0.1'
        when wallet.balance <= 1 then '0.1-1'
        when wallet.balance <= 10 then '1-10'
        when wallet.balance <= 100 then '10-100'
        when wallet.balance <= 1000 then '100-1000'
        when wallet.balance <= 10000 then '1000-10000'
        else '>10000'
    end as Range,
  count(1) as Count
  from wallet
  group by Range
  ORDER BY Range ASC;
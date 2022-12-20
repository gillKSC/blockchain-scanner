import supabase from './supabase';
import { useRouter } from 'next/router';

export default function PageWithJSbasedForm() {
  // Handles the submit event on form submit.
  const router = useRouter();
  const handleSubmit = async (event) => {
    // Stop the form from submitting and refreshing the page.
    event.preventDefault();

    // Get data from the form.
    const data = {
      input: event.target.input.value,
    };
    let length = data.input.length;
    console.log(length);
    // Send the form data to supabase and get a response.
    if (length == 42) {
      const { data: result, error } = await supabase
        .from('wallet')
        .select('*')
        .eq('address', data.input)
        .single();
      router.push(`/wallet/${result.address}`);
    } else if (length == 8) {
      const { data: result, error } = await supabase
        .from('block')
        .select('*')
        .eq('blockid', data.input)
        .single();
      router.push(`/block/${result.blockid}`);
    } else if (length == 66) {
      const { data: result, error } = await supabase
        .from('transaction')
        .select('*')
        .eq('transactionhash', data.input)
        .single();
      router.push(`/transaction/${result.transactionhash}`);
    } else {
      alert(
        `you can only search for wallet address, block id, or transaction hash`
      );
    }
  };
  return (
    // We pass the event to the handleSubmit() function on submit.
    <form onSubmit={handleSubmit}>
      <label htmlFor='input'></label>
      <input type='text' id='input' name='input' required />
      <button type='submit'>Search</button>
    </form>
  );
}

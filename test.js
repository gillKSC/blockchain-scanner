const { createClient } = require('@supabase/supabase-js');
const express = require('express');
const app = express();
const port = 3000;
const supabase = createClient(
  'https://viqaqlyfbhvqerbkpedh.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpcWFxbHlmYmh2cWVyYmtwZWRoIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzE0MDE4MTQsImV4cCI6MTk4Njk3NzgxNH0.N73T29e-2Dg50oDxXSYgeHfKsTzlXlF7Uu8AGUU1ZZ0'
);

async function test() {
  try {
    const { data: wallet, error } = await supabase.from('wallet').select();

    // Insert a row

    console.log(wallet, error);
  } catch (error) {
    console.error(error);
  }
}
test();

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import supabase from '../utils/supabase';
import styles from '../styles/Home.module.css';

export default function BarChart({ data }) {
  const canvasEl = useRef(null);

  let range = data.map((a) => a.range);
  let count = data.map((a) => a.count);
  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');
    // const ctx = document.getElementById("myChart");
    const data = {
      labels: range,
      datasets: [
        {
          label: 'balance frequency',
          data: count,
        },
      ],
    };
    const config = {
      type: 'bar',
      data: data,
    };
    Chart.defaults.font.size = 10;
    const myBarChart = new Chart(ctx, config);
    return function cleanup() {
      myBarChart.destroy();
    };
  });

  return (
    <div className={styles.graph}>
      <div className={styles.section}>
        <canvas id='myBarChart' ref={canvasEl} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { data, error } = await supabase.from('wallet_freq').select('*');

  return {
    props: {
      data: data,
    },
  };
}

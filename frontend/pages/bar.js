import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import supabase from '../utils/supabase';
import styles from '../styles/Home.module.css';

export default function BarChart({ data }) {
  const canvasEl = useRef(null);

  let balance = data.map((a) => a.balance);
  const max = Math.max(balance);
  let frequency = balanceay(10)
    .fill()
    .map((x, i) => i);
  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');
    // const ctx = document.getElementById("myChart");
    const data = {
      labels: miner,
      datasets: [
        {
          label: 'block value',
          data: balance,
        },
      ],
    };
    const config = {
      type: 'line',
      data: data,
    };
    Chart.defaults.font.size = 10;
    const options = {
      scales: {
        x: {
          type: 'linear',
          offset: false,
          grid: {
            offset: false,
          },
          ticks: {
            stepSize: 1,
          },
          title: {
            display: true,
            text: 'Hours',
            font: {
              size: 14,
            },
          },
        },
        y: {
          // beginAtZero: true
          title: {
            display: true,
            text: 'Visitors',
            font: {
              size: 14,
            },
          },
        },
      },
    };
    const myBarChart = new Chart(ctx, config, options);
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
  const { data, error } = await supabase.from('wallet').select('*');

  return {
    props: {
      data: data,
    },
  };
}

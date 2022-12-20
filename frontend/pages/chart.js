import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';
import supabase from '../utils/supabase';
import styles from '../styles/Home.module.css';

function date(unixTimestamp) {
  var date = new Date(unixTimestamp * 1000);
  let day = date.toLocaleDateString('en-US').toString();
  let time = date.toLocaleTimeString('en-US').toString();
  return day.concat(' ', time);
}
export default function LineChart({ data }) {
  const canvasEl = useRef(null);

  let time = data.map((a) => a.time);
  let transaction_count = data.map((a) => a.count);
  
  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');
    // const ctx = document.getElementById("myChart");
    const data = {
      labels: time,
      datasets: [
        {
          label: 'block transaction count',
          data: transaction_count,
          fill: false,
          borderWidth: 2,
          lineTension: 0.2,
          pointRadius: 1,
        },
      ],
    };
    const config = {
      type: 'line',
      data: data,
    };
    Chart.defaults.font.size = 10;
    const myLineChart = new Chart(ctx, config);
    return function cleanup() {
      myLineChart.destroy();
    };
  });

  return (
    <graph>
      <div className={styles.section}>
        <canvas id='myLineChart' ref={canvasEl} />
      </div>
    </graph>
  );
}

export async function getServerSideProps() {
  const { data, error } = await supabase.from('transaction_count').select('*');
  const newData = (data) =>
    data.map((item) => {
      var time = date(item.timestamp);
      return { ...item, time };
    });

  return {
    props: {
      data: newData(data),
    },
  };
}

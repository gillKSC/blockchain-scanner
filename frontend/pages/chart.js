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

  const colors = {
    purple: {
      default: 'rgba(149, 76, 233, 1)',
      half: 'rgba(149, 76, 233, 0.5)',
      quarter: 'rgba(149, 76, 233, 0.25)',
      zero: 'rgba(149, 76, 233, 0)',
    },
    indigo: {
      default: 'rgba(80, 102, 120, 1)',
      quarter: 'rgba(80, 102, 120, 0.25)',
    },
  };
  let time = data.map((a) => a.time);
  let reward = data.map((a) => a.blockreward);
  useEffect(() => {
    const ctx = canvasEl.current.getContext('2d');
    // const ctx = document.getElementById("myChart");

    const gradient = ctx.createLinearGradient(0, 16, 0, 600);
    gradient.addColorStop(0, colors.purple.half);
    gradient.addColorStop(0.65, colors.purple.quarter);
    gradient.addColorStop(1, colors.purple.zero);
    const data = {
      labels: time,
      datasets: [
        {
          backgroundColor: gradient,
          label: 'block value',
          data: reward,
          fill: true,
          borderWidth: 2,
          borderColor: colors.purple.default,
          lineTension: 0.2,
          pointBackgroundColor: colors.purple.default,
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
    <div className={styles.graph}>
      <div className={styles.section}>
        <canvas id='myLineChart' ref={canvasEl} />
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  const { data, error } = await supabase.from('block').select('*');
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

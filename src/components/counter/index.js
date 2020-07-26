import React, { useState, useEffect, useRef } from 'react';
import Flipper from './Flipper';
import styles from './style.less';

const getTimeText = (format, leftTime) => {
  // console.log(format);
  const d = 100;
  const h = /H/.test(format) ? 100 : 24;
  const m = /M/.test(format) ? 100 : 60;
  const s = /S/.test(format) ? 100 : 60;

  const day = Math.floor((leftTime % (d * h * m * s)) / (h * m * s));
  const hor = Math.floor((leftTime % (h * m * s)) / (m * s));
  const min = Math.floor((leftTime % (m * s)) / s);
  const sec = leftTime % s;

  const times = [];
  const fm = format.toLowerCase();

  for (let i = fm.length - 1; i >= 0; i -= 1) {
    switch (fm[i]) {
      case 'd':
        if (fm[i + 1] === 'd') {
          times.unshift({ index: i, data: Math.floor(day / 10) });
        } else {
          times.unshift({ index: i, data: day % 10 });
        }
        break;
      case 'h':
        if (fm[i + 1] === 'h') {
          times.unshift({ index: i, data: Math.floor(hor / 10) });
        } else {
          times.unshift({ index: i, data: hor % 10 });
        }
        break;
      case 'm':
        if (fm[i + 1] === 'm') {
          times.unshift({ index: i, data: Math.floor(min / 10) });
        } else {
          times.unshift({ index: i, data: min % 10 });
        }
        break;
      case 's':
        if (fm[i + 1] === 's') {
          times.unshift({ index: i, data: Math.floor(sec / 10) });
        } else {
          times.unshift({ index: i, data: sec % 10 });
        }
        break;
      default:
        times.unshift({ index: i, data: fm[i] });
    }
  }

  return {
    leftTime,
    times,
  };
};

export default function ({
  option: { leftSecond = 0, format = 'dd:hh:mm:ss', end = () => { }, style = {}, standard },
}) {
  const prevLeftSecond = useRef(leftSecond);
  const [{ times, leftTime }, setLeftTime] = useState(getTimeText(format, leftSecond));

  useEffect(() => {
    let id;
    let fn = () => { };
    if (prevLeftSecond.current !== leftSecond) {
      prevLeftSecond.current = leftSecond;
      setLeftTime(() => getTimeText(format, leftSecond));
    } else if (leftTime > 0) {
      id = setInterval(() => {
        setLeftTime(prevData => getTimeText(format, prevData.leftTime - 1));
      }, 1000);
      fn = () => clearInterval(id);
    } else {
      id = setTimeout(() => {
        end();
      }, 1000);
      fn = () => clearTimeout(id);
    }

    return fn;
  }, [leftTime, end, format, prevLeftSecond, leftSecond]);

  return (
    <div className={styles['count-down']} style={{ fontSize: standard }}>
      {times.map(item => (
        <Flipper now={item.data} index={item.index} style={style} />
      ))}
    </div>
  );
}

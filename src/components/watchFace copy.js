import React, { useState } from 'react';
import Gauge from './guage';
import Dial from './dial';
import geometryHelpers from '../helpers/geometry';

const { findRotation } = geometryHelpers;

const WatchFace = () => {

  //state
  const [workSec, setWorkSec] = useState(1500);
  const [restSec, setRestSec] = useState(300);
  const [dragSource, setDragSource] = useState(null);
  const [dragTarget, setDragTarget] = useState(null);

  let dragging = null;

  let targetUpdateInterval = null;

  const dragStart = (source) => {
    if(!dragSource) {
      dragging = source;
      setDragSource(source);
      newTarget = null;
      document.addEventListener('mouseup', dragEnd);
      document.addEventListener('touchend', dragEnd);
      document.addEventListener('touchmove', touchMoveHandler, false);
      targetUpdateInterval = setInterval(() => {
        if (newTarget !== null && newTarget !== dragTarget) setDragTarget(newTarget);
      }, 100);
    }
  }

  const dragEnd = () => {
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
    document.removeEventListener('touchmove', touchMoveHandler, false);
    clearInterval(targetUpdateInterval);
    targetUpdateInterval = null;
    if (newTarget !== null) {
      if (dragging === 'rest') setRestSec(newTarget * 10);
      else setWorkSec(newTarget * 10 - restSec);
    }
    setDragSource(null);
  }

  const isDragRange = (deg) => {
    const total = deg * 10 + (dragging === 'rest' ? workSec : 0);
    if (total > 3600) return false;
    if (dragging === 'rest') return deg < (restSec + workSec) / 10;
    else return deg > restSec / 10;
  }

  let newTarget = null;

  const dragEnter = ({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    if(element && element.classList.contains('dial-target')) {
      const deg = findRotation(element.parentNode);
      if (newTarget !== deg && isDragRange(deg)) newTarget = deg;
    }
  }

  const touchMoveHandler = (evt) => {
    const x = evt.changedTouches[0].pageX;
    const y = evt.changedTouches[0].pageY;
    dragEnter({ x, y });
  }

  const marks = [];

  for (let i = 0; i < 60; i++) {
    marks.push(
      <div className="mark" key={`mark-${i}`}>
        <span
          className="dial-target"
        ></span>
      </div>
    );
  }


  return (
    <div className="clock-face">
      <figure className="minute-hand"></figure>
      <figure className="second-hand"></figure>
      <figure className="hand-anchor"></figure>
      <Gauge restSec={restSec} workSec={workSec} />
      <Dial
        dialId="rest"
        dragStart={dragStart}
        dragOn={dragSource === 'rest'}
        rotation={
          dragSource === 'rest' ? dragTarget : restSec / 10
        }
      />
      <Dial
        dialId="work"
        dragStart={dragStart}
        dragOn={dragSource === 'work'}
        rotation={
          dragSource === 'work' ? dragTarget : (workSec + restSec) / 10
        }
      />
      <figure className="controls">
        <figure className="btn-main">
          <span id="startClock" className="go"></span>
          <span id="stopClock" className="stop hide"></span>
        </figure>
        <figure className="btn-reset">
          <span id="resetClock" className="loop">↻</span>
        </figure>
      </figure>
      { marks }
    </div>
  );
};

export default WatchFace;
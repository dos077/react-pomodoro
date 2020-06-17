import React, { useReducer } from 'react';
import Gauge from './guage';
import Dial from './dial';
import geometryHelpers from '../helpers/geometry';
import reducer from '../reducers/dial';
import CreateTimer from '../controllers/timer';
import ClockControls from '../controllers/clock';

const { findRotation } = geometryHelpers;

const initialState = {
  workSec: 1500,
  restSec: 300,
  dragSource: null,
  dragTarget: null,
  isRunning: false,
  isAnimate: false,
  minHand: 0
}

const timer = CreateTimer();
timer.set(
  initialState.restSec,
  initialState.workSec
);

const init = (initialState) => ({ ...initialState });

const WatchFace = () => {
  //state
  const [state, dispatch] = useReducer(reducer, initialState, init);

  const clockController = ClockControls(timer, dispatch);

  const dragStart = (source) => {
    dispatch({ type: 'dragStart', payload: source });
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchmove', touchMoveHandler);
    document.addEventListener('mousemove', mouseMoveHandler);
  }

  const dragEnd = () => {
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchend', dragEnd);
    document.removeEventListener('touchmove', touchMoveHandler);
    document.removeEventListener('mousemove', mouseMoveHandler);
    if (state.dragSource === 'rest') timer.set({ rest: state.dragTarget * 10 });
    else timer.set({ work: state.dragTarget * 10 - state.restSec });
    dispatch({ type: 'dragEnd' });
  }

  const dragEnter = ({ x, y }) => {
    const element = document.elementFromPoint(x, y);
    const deg = findRotation(element.parentNode);
    dispatch({ type: 'dragEnter', payload: deg });
  }

  const mouseMoveHandler = (evt) => {
    dragEnter(evt);
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
      <figure
        className="minute-hand"
        style={{
          transform: `rotate(${state.minHand}deg)`
        }}
      ></figure>
      <figure
        className="second-hand"
        style={{
          animation: state.setAnimate ? 'clock 60s steps(300) infinite' : 'none',
          animationPlayState: state.isRunning ? 'running' : 'paused'
        }}
      ></figure>
      <figure className="hand-anchor"></figure>
      <Gauge restSec={state.restSec} workSec={state.workSec} />
      <Dial
        dialId="rest"
        dragStart={dragStart}
        dragOn={state.dragSource === 'rest'}
        rotation={
          state.dragSource === 'rest' ? state.dragTarget : state.restSec / 10
        }
      />
      <Dial
        dialId="work"
        dragStart={dragStart}
        dragOn={state.dragSource === 'work'}
        rotation={
          state.dragSource === 'work' ? state.dragTarget : (state.workSec + state.restSec) / 10
        }
      />
      <figure className="controls">
        <figure className="btn-main">
          <span
            id="startClock"
            className={ state.isRunning ? 'go hide' : 'go' }
            onClick={ clockController.start }
          ></span>
          <span
            id="stopClock"
            className={ state.isRunning ? 'stop' : 'stop hide' }
            onClick={ clockController.stop }
          ></span>
        </figure>
        <figure className="btn-reset">
          <span id="resetClock"
            className={ state.isRunning ? 'stop hide' : 'stop' }
            onClick={ clockController.reset }
          ></span>
        </figure>
      </figure>
      { marks }
    </div>
  );
};

export default WatchFace;
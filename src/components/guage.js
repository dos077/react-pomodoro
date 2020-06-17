import React from 'react';
import geometryHelpers from '../helpers/geometry';

const Gauge = (props) => {
  //helper
  const { getClipPath } = geometryHelpers;

  const stops = [];

  for (let i = 0; i < 12; i++) {
    stops.push(
      <div className="stop" key={`stop-${i}`}></div>
    )
  }

  return (
    <figure className="gauge">
      <figure
        id="main-gauge"
        className="ring"
        style={{
          clipPath: getClipPath(props.restSec / 10, (props.restSec + props.workSec) / 10)
        }}
      ></figure>
      <figure
        id="rest-gauge"
        className="ring"
        style={{ clipPath: getClipPath(0, props.restSec / 10) }}
      ></figure>
      { stops }
    </figure>
  )
};

export default Gauge;
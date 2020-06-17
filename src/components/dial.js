import React from 'react';

const Dial = (props) => {

  const dragStart = () => {
    props.dragStart(props.dialId)
  }

  return (
    <figure
      id={props.dialId + 'Dial'}
      className="dial"
      onMouseDown={dragStart}
      onTouchStart={dragStart}
      style={{
        transform: `rotate(${props.rotation}deg)`
      }}
    >
      <span
        id={props.dialId + 'Point'}
        className="dial-point"
        style={{
          transform: props.dragOn ? 'scale(2,3)' : '',
          opacity: props.dragOn ? '0.6' : ''
        }}
      ></span>
    </figure>
  )
};

export default Dial;
const deg2delta = (deg) => {
  let y, x;
  if(deg<=45) {
    y = 0;
    x = Math.tan(deg * Math.PI / 180 );
  } else {
    x = 1;
    y = 1 - Math.tan( (90 - deg) * Math.PI / 180 );
  }
  return {x, y};
}

const deg2point = (deg) => {
  let x, y;
  let base = 50;
  if(deg <= 90) {
    let delta = deg2delta(deg);
    x = base * ( 1 + delta.x);
    y = base * delta.y;
  } else if(deg <= 180) {
    let delta = deg2delta(deg-90);
    x = base * ( 2 - delta.y );
    y = base * ( 1 + delta.x );
  } else if(deg <= 270) {
    let delta = deg2delta(deg-180);
    x = base * ( 1 - delta.x );
    y = base* ( 2 - delta.y );
  } else {
    let delta = deg2delta(deg - 270);
    x = base * delta.y;
    y = base * ( 1 - delta.x );
  }
  return `${x}% ${y}%`;
}

const getClipPath = (start, end) => {
  let points = ['50% 50%'];
  points.push(deg2point(start));
  if(start<45 && end>45) { points.push('100% 0'); }
  if(start<135 && end>135) { points.push('100% 100%'); }
  if(start<225 && end>225) { points.push('0 100%'); }
  if(start<315 && end>315) { points.push('0 0'); }
  points.push(deg2point(end));
  return 'polygon(' + points.join(', ') + ')';
}

const findRotation = (e) => {
  const transform = window.getComputedStyle(e).getPropertyValue('transform');
  const matrixValues = transform.substr(7).split(',');
  let deg = Math.acos(matrixValues[0]) * (180 / Math.PI);
  deg = Math.round(deg);
  if(matrixValues[1]<=matrixValues[2]) {
    deg = 360 - deg;
  }
  return deg;
}

export default { getClipPath, findRotation }
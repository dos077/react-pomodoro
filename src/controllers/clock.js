const clockControl = (timer, dispatch) => {
  let syncInterval;
  let countDown;
  let secondTimer;

  const setCountDown = () => {
    let workLeft = timer.timeLeft().work;
    let restLeft = timer.timeLeft().rest;
    if(!countDown && workLeft > 0 && workLeft < 15) { 
      countDown = setTimeout(function(){
        countDown = null;
      }, workLeft*1000 );
    } else if(!countDown && restLeft > 0 && restLeft < 15) {
      countDown = setTimeout(function(){
        countDown = null;
      }, restLeft*1000 );
    }
  }

  const setSecondTimer = (secTo60) => {
    if(!secondTimer && secTo60 <= 11 && secTo60 > 0) {
      let timeOut = secTo60 * 1000 - 200;
      secondTimer = setTimeout(function(){ 
        resetSecond(true); 
        secondTimer = null;
      }, timeOut);
    }
  }

  const syncTime = () => {
    let timeLeft = timer.timeLeft().total;
    syncMinute(timeLeft);
    if (timeLeft < 0) { 
      stop();
    } else {
      let secTo60 = timeLeft % 60;
      setSecondTimer(secTo60);
      setCountDown();
    }
  }

  const syncMinute = (seconds) => {
    let steps = Math.floor( seconds / 10 );
    let deg = 1 * steps;
    dispatch({ type: 'setMinHand', payload: deg });
  }

  const resetSecond = () => {
    dispatch({ type: 'setAnimation', payload: false });
    setTimeout(function(){
      dispatch({ type: 'setAnimation', payload: true });
    }, 100);
  }

  const start = () => {
    timer.start();
    syncTime();
    dispatch({ type: 'setAnimation', payload: true });
    dispatch({ type: 'startClock' });
    syncInterval = setInterval( syncTime, 10000 );
  }

  const stop = () => {
    clearInterval(syncInterval);
    clearTimeout(countDown);
    clearTimeout(secondTimer);
    timer.stop();
    dispatch({ type: 'stopClock' });
  }

  const reset = (play = false) => {
    timer.set();
    syncTime();
    resetSecond(false);
    if(play === true) { console.log('starting after reset'); start(); }
  }
 
  return { start, stop, reset }

} 

export default clockControl;
const createTimer = () => {
  let restTime;
  let workTime;
  let endTime;
  let totalTime;
  let loop = false;

  const set = (rest = restTime, work = workTime) => {
    restTime = rest;
    workTime = work;
    totalTime = rest + work;
    endTime = null;
  }

  const start = () => {
    endTime = new Date();
    endTime.setSeconds( endTime.getSeconds() + totalTime );
  }

  const timeLeft = () => {
    let work = workTime;
    let rest = restTime;
    const now = new Date();
    if(endTime) {
      if (loop) {        
        totalTime = restTime + workTime;
        while (endTime < now) {
          endTime.setSeconds(endTime.getSeconds() + totalTime);
        }
      }
      totalTime = Math.round( ( endTime - now ) / 1000 );
      if (totalTime > rest) { work = totalTime - rest; }
      else {
        work = 0;
        rest = totalTime;
      }
    }
    return { rest, work, total: totalTime };
  };

  const timeElapse = () => {
    return restTime + workTime - timeLeft().total;
  }

  const stop = () => {
    timeLeft();
    endTime = null;
  }

  const setLoop = (toggle) => {
    if (toggle) { loop = !loop; }
    return loop;
  }

  return { set, start, stop, timeLeft, timeElapse, setLoop }
};

export default createTimer;
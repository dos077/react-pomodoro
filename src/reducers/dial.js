const isInRange = (deg, source, restSec, workSec) => {
  const total = deg * 10 + (source === 'rest' ? workSec : 0);
  if (total > 3600) return false;
  if (source === 'rest') return deg < (restSec + workSec) / 10;
  else return deg > restSec / 10;
}

export default (state, action) => {
  switch(action.type) {
    case 'dragStart':
      return { ...state, dragSource: action.payload };
    case 'dragEnd':
      const changes = {};
      if (state.dragTarget !== null) {
        if (state.dragSource === 'rest') changes.restSec = state.dragTarget * 10;
        else changes.workSec = state.dragTarget * 10 - state.restSec;
      }
      return {
        ...state,
        dragSource: null,
        dragTarget: null,
        ...changes
      }
    case 'dragEnter':
      if (isInRange(action.payload, state.dragSource, state.restSec, state.workSec)) {
        return { ...state, dragTarget: action.payload };
      } else return state;
    case 'startClock':
      return { ...state, isRunning: true };
    case 'stopClock':
      return { ...state, isRunning: false };
    case 'setAnimation':
      return { ...state, isAnimate: action.payload };
    case 'setMinHand':
      return { ...state, minHand: action.payload };
    default:
      throw new Error('unknown dispatch');
  }
}
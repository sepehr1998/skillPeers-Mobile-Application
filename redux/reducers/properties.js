
var probs= {};
export default function(state= probs, action){
  switch (action.type) {
    case 'GET_PROPERTIES': return action.payload;
  }
  return state;
}
 
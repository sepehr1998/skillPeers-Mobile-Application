
export default function(state= null, action){
  switch (action.type) {
    case 'GET_PROFILE':{
      state = action.payload;
    }
  }
  return state;
}
 
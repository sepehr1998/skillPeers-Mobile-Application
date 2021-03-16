
export default function(state= null, action){
  switch (action.type) {
    case 'USER_LOGINED': 
    {
      return action.payload;
    }
  }
  return state;
}
 
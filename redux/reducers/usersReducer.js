
var users= [];
export default function(state=users, action){
  switch (action.type) {
    case 'GET_USERS': {
       users = action.payload;
     // console.log(action, 'action');
      return users;
    }
  }
  return users;
}



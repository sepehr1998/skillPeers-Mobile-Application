
var repoCountry= [];
export default function(state=repoCountry, action){
  switch (action.type) {
    case "Get_RepoCountryForFilter": { repoCountry = action.payload;
     // console.log(action, 'action');
      return repoCountry;
    }
  }
  return repoCountry;
}

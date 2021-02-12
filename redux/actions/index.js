export function getRepos(response) {
    return {
      type: 'Get_Repos',
      payload: response
    }
  }
  
  export function getRepoSkillForFilter(response) {
    return {
      type: 'Get_RepoSkillForFilter',
      payload: response
    }
  }
  
  export function getRepoCountryForFilter(response) {
    return {
      type: 'Get_RepoCountryForFilter',
      payload: response
    }
  }
  
  
  
  export function getRepoThunk(term, price, exprOrPrice, skills, countries,page,size,token) {
    //alert(exprOrPrice)
    let priceSort = "ASCENDING";
    if (price == 0) priceSort = "ASCENDING"
    else priceSort = "DESCENDING"
  
    return function (dispatch, getState) {
  
      fetch('http://44.240.53.177/api/pub/users/search?page='+page+'&size='+size+'&skillIds=' + skills + '&countryIds=' + countries + '&sort[0].column=' + exprOrPrice + '&sort[0].type=' + priceSort + '&term=' + term + '&firstName=',
        {
          method: 'GET',
          headers: {
            'Authorization': ""+token+""
          }
        })
        .then(e => e.json())
        .then(function (response) {
          //console.log(response)
          // var arr = response//.slice(0,10);
          dispatch(getRepos(response));
        }).catch((error) => {
          alert(error, "ERRRRRORRR");
        });
    }  
  }  
  
  
  export function getRepoSkillsForFilterThunk() {
    return function (dispatch, getState) {
      fetch('http://44.240.53.177/api/pub/skills?')
        .then(e => e.json())
        .then(function (response) {
          dispatch(getRepoSkillForFilter(response))
        }).catch((error) => {
          alert(error, "ERRRRRORRR");
        });
    }
  }
  
  export function getRepoCountriesForFilterThunk() {
    return function (dispatch, getState) {
      fetch('http://44.240.53.177/api/pub/countries?')
        .then(e => e.json())
        .then(function (response) {
          dispatch(getRepoCountryForFilter(response))
        }).catch((error) => {
          alert(error, "ERRRRRORRR");
        });
    }
  }
  
  export function repoSelected(repo) {
  
    return {
      type: 'Repo_Selected',
      payload: repo
    }
  }
  
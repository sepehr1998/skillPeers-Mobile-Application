

var repoSkill= [];
export default function(state=repoSkill, action){
  switch (action.type) {
    case "Get_RepoSkillForFilter": { repoSkill = action.payload;
     // console.log(action, 'action');
      return repoSkill;
    }
  }
  return repoSkill;
}

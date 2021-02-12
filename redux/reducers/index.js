import {combineReducers} from 'redux';
import GitReducer from './gitReducer.js';
import SkillReducer from './skillReducer.js';
import CountryReducer from './countryReducer.js';
import ActiveRepo from './activeReducer.js';

const allReducers= combineReducers({
  repos: GitReducer,
  skillsForFilter: SkillReducer,
  countriesForFilter: CountryReducer,
  activeRepo: ActiveRepo,
});

export default allReducers;

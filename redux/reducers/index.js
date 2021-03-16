import {combineReducers} from 'redux';
import UsersReducer from './usersReducer.js';
import SkillReducer from './skillReducer.js';
import CountryReducer from './countryReducer.js';
import CurrentUser from './currentUser.js';
import CurrentUserProfile from './currentUserProfile.js';
import Properties from './properties.js';

const allReducers= combineReducers({
  users: UsersReducer,
  skillsForFilter: SkillReducer,
  countriesForFilter: CountryReducer,
  currentUser: CurrentUser,
  profile: CurrentUserProfile,
  applicationProbs:Properties
});

export default allReducers;

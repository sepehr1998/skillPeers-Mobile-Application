import {combineReducers} from 'redux';
import UsersReducer from './usersReducer.js';
import SkillReducer from './skillReducer.js';
import CountryReducer from './countryReducer.js';
import CurrentUser from './currentUser.js';
import CurrentUserProfile from './currentUserProfile.js';

const allReducers= combineReducers({
  users: UsersReducer,
  skillsForFilter: SkillReducer,
  countriesForFilter: CountryReducer,
  currentUser: CurrentUser,
  profile: CurrentUserProfile,
});

export default allReducers;

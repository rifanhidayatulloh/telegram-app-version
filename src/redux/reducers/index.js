import { combineReducers } from 'redux';

import detailUser from './userDetailId';
import getAlluser from './getAllUser';

const rootReducer = combineReducers({
  detailUser,
  getAlluser
});

export default rootReducer;

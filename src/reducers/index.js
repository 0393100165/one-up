import { combineReducers } from 'redux';
import isAdmin from '../reducers/DungChung/isAdminReducer';
import objectIDDuocChon from '../reducers/DungChung/objectIDDangDuocChonReducer';

import reloadAnh from '../reducers/DungChung/reloadAnhReducer';


const allReducers = combineReducers({

    isAdmin,
    objectIDDuocChon,
    reloadAnh,

})

export default allReducers;
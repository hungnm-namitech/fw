import { combineReducers } from '@reduxjs/toolkit';
import newOrderFormValue from './newOrderFormValue';
import order from './order';

export default combineReducers({ newOrderFormValue, order });

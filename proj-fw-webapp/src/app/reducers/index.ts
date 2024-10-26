import { combineReducers } from '@reduxjs/toolkit';
import orders from './orders';
import auth from './auth';

export default combineReducers({ orders, auth });

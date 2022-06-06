import React from 'react';
import {Navigate} from "react-router-dom";
import { getCookie } from '../../Services/cookies';

function RedirectRouter({route}){
return getCookie()?route:<Navigate to="/login" replace/>
}

export default  RedirectRouter;

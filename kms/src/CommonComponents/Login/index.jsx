/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CulturalPromotion from './CulturalPromotion';
import LoginForm from './LoginForm';

export default class Login extends Component {
  render() {
    return (
      <div id="login-page" className="flex-row">
        <div className="float-left height-allpage" style={{ width: '50%', backgroundColor: '#565373', minHeight: '577px' }}>
          <LoginForm />
        </div>
        <div className="float-right" style={{ width: '50%' }}>
          <CulturalPromotion />
        </div>
      </div>
    );
  }
}

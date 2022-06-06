/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import pic from '../../img/PromotionPic.png';
export default class CulturalPromotion extends Component {
  render() {
    return (
      <React.Fragment>
        <div id="promotion" style={{ margin: '50px auto', backgroundColor: 'white', padding: '20px', width: '550px' }}>
          <div className="margin-top-m margin-bottom-l">
            <img src={pic} alt="pic" width={500} />
          </div>
          <p className="text-center padding-s margin-top-m">
            Welcome to Just Do It, aka Personal Karma Management System. The system is only for personal goal management, and is committed to helping people find their true goals and ideals, clearly understand themselves, and rationally and accurately analyze their own goals and ideals.{' '}
          </p>
        </div>
      </React.Fragment>
    );
  }
}

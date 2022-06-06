/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';

export default class Plan extends Component {
  render() {
    return (
      <div>
        <CustomBreadcrumb primaryHeading="plan" secondaryHeading="planhome" />
        Idea Plan
      </div>
    );
  }
}

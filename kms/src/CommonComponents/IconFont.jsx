/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import { createFromIconfontCN } from '@ant-design/icons';
import React, { Component } from 'react';

const IconFonts = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_3318814_zmr3chs1uo.js',
});

/**
 * CustomBreadcrumb is used to diaplay breadcrumb in every page.
 * There are the following props:
 * @property {string} iconName
 * @property {string} cssProperty "eg: style={{ fontSize: '40px', paddingRight: '1px'}}"
 * */

export default class IconFont extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return <IconFonts type={this.props.type} style={this.props.style} />;
  }
}

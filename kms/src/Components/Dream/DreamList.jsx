/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import { Table, Tag, Tooltip, Button, notification, Popconfirm, message } from 'antd';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import * as DreamServices from '../../Services/PackageServices/DreamServices';
import { DialogType, Dream } from '../../Services/EnumValue';
import '../../CommonComponents/commonCss.css';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusSquareOutlined } from '@ant-design/icons';
import PreviewDream from './PreviewDream';
import DialogDream from './DialogDream';

export default class DreamList extends Component {
  constructor() {
    super();
    this.state = {
      dreamList: [],
      tableLoading: true,
      selectedRowKeys: [],
      selectedRows: [],
      isShowPreview: false,
      isShowDialog: false,
      dialogType: DialogType.Create,
      pagination: {
        current: 1,
        pageSize: 7,
      },
    };
    this.columns = this.initColumns();
  }
  initColumns = () => {
    return [
      {
        title: 'Dream',
        dataIndex: 'DreamTopic',
        render: text => <a>{text}</a>,
        width: 300,
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: 'Skills',
        dataIndex: 'SkillNames',
        width: 200,
        render: tags => (
          <>
            {tags?.map(tag => {
              return (
                <Tag color="purple" key={tag}>
                  {tag.toUpperCase()}
                </Tag>
              );
            })}
          </>
        ),
      },
      {
        title: 'Date Created',
        dataIndex: 'CreateDate',
        render: date => <>{new Date(date).toLocaleDateString()}</>,
        width: 120,
      },
      {
        title: 'Type',
        dataIndex: 'DreamType',
        align: 'center',
        render: data => <>{data === Dream.Career ? 'Career' : data === Dream.Life ? 'Life' : 'Dream'}</>,
        width: 85,
        filters: [
          {
            text: 'Dream',
            value: Dream.Dream,
          },
          {
            text: 'Life',
            value: Dream.Life,
          },
          {
            text: 'Career',
            value: Dream.Career,
          },
        ],
        onFilter: (value, record) => record.DreamType === value,
        //console.log("record:",record.DreamType)
        //record.DreamType.indexOf(value) === 0,
      },
      {
        title: 'Influence',
        dataIndex: 'InfluenceLevel',
        align: 'center',
        ellipsis: true,
        width: 110,
        sorter: (a, b) => b.InfluenceLevel - a.InfluenceLevel,
      },
      {
        title: 'Difficulty',
        dataIndex: 'DifficultyLevel',
        align: 'center',
        ellipsis: true,
        width: 110,
        sorter: (a, b) => b.DifficultyLevel - a.DifficultyLevel,
      },
    ];
  };

  componentDidMount = () => {
    this.getDramList();
  };
  getDramList = () => {
    DreamServices.listDream()
      .then(res => {
        let temp = [];
        res.map(item => {
          temp.push(Object.assign(item, { key: item.Id }));
        });
        // console.log('dreamList:', temp);
        this.setState({
          dreamList: temp,
          tableLoading: false,
          selectedRowKeys: [],
        });
      })
      .catch(function (e) {
      
        notification.open({
          message: 'Data Loading Error',
          description: 'Data loading error, please quit and try again or try again later.',
        });
      });
      this.setState({
        tableLoading: false,
      });
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log('ids:', selectedRowKeys);
    this.setState({ selectedRowKeys, selectedRows });
  };

  onClickShowPreview = () => {
    this.setState({ isShowPreview: true });
  };
  onHidePreview = () => {
    this.setState({ isShowPreview: false });
  };

  onClickShowDialog = type => {
    this.setState({ isShowDialog: true, dialogType: type });
  };

  onHideDialog = () => {
    this.setState({ isShowDialog: false });
  };

  onChangePage = page => {
    //console.log('page:', page);
    this.setState({ pagination: page });
  };

  confirm = () => {
    this.setState({ tableloading: true });
    DreamServices.deleteDream(this.state.selectedRowKeys[0])
      .then(res => {
        // console.log('DETELEres:', res);
        switch (res) {
          case 0:
            message.success('Dream deleted successfully.');
            this.getDramList();
            break;
          case 507:
            message.error('There is an associated Plan that has not been processed, please process it and try again.');
            break;
          case 3:
            message.error('There was an error updating user, please refresh or try again later.');
            break;
          case 1:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        this.setState({ tableLoading: false });
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
    this.setState({ tableLoading: false });
  };

  render() {
    const rowSelection = { selectedRowKeys: this.state.selectedRowKeys, onChange: this.onSelectChange };

    return (
      <div id="dream-list">
        <CustomBreadcrumb primaryHeading="dream" secondaryHeading="dreamList" />
        <div className="flex-row margin-bottom-l">
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={this.onClickShowDialog.bind(this, DialogType.Create)}>
            Create New Dream
          </Button>
          <span className="margin-left-m" />
          <Button icon={<EyeOutlined />} disabled={this.state.selectedRowKeys?.length != 1} onClick={this.onClickShowPreview}>
            Preview
          </Button>
          <span className="margin-left-m" />
          <Button icon={<EditOutlined />} disabled={this.state.selectedRowKeys?.length != 1} onClick={this.onClickShowDialog.bind(this, DialogType.Edit)}>
            Edit
          </Button>
          <span className="margin-left-m" />
          <Popconfirm title="Are you sure to delete this Dream?" onConfirm={this.confirm} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} disabled={this.state.selectedRowKeys?.length != 1}>
              Delete
            </Button>
          </Popconfirm>
        </div>
        <Table columns={this.columns} dataSource={this.state.dreamList} loading={this.state.tableLoading} rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.onChangePage} />

        {this.state.isShowPreview && <PreviewDream dreamData={this.state.selectedRows} onHidePreview={this.onHidePreview} isShowPreview={this.state.isShowPreview} />}
        {this.state.isShowDialog && <DialogDream dreamData={this.state.selectedRows[0]} dialogType={this.state.dialogType} isShowDialog={this.state.isShowDialog} onHideDialog={this.onHideDialog} getDramList={this.getDramList} />}
      </div>
    );
  }
}

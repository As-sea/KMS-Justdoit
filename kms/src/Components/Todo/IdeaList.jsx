/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import { Table, Tag, Tooltip, Button, notification, Popconfirm, message } from 'antd';
import { DialogType } from '../../Services/EnumValue';
import '../../CommonComponents/commonCss.css';
import { EditOutlined, DeleteOutlined, PlusSquareOutlined, CheckCircleFilled, CloseCircleFilled, SyncOutlined, CheckOutlined } from '@ant-design/icons';
import * as TodoServices from '../../Services/PackageServices/TodoServices';
import { Todo } from '../../Services/EnumValue';
import DialogIdea from './DialogIdea';

export default class IdeaList extends Component {
  constructor() {
    super();
    this.state = {
      ideaList: [],
      tableLoading: true,
      selectedRowKeys: [],
      selectedRows: [],
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
        title: 'Idea',
        dataIndex: 'TodoTopic',
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      {
        title: 'Detials',
        dataIndex: 'TodoItem',
        ellipsis: { showTitle: false },
        render: text => (
          <Tooltip placement="topLeft" title={text} style={{whiteSpace:"pre-wrap"}}>
            <span>{text}</span>
          </Tooltip>
        ),
      },
    ];
  };

  componentDidMount = () => {
    this.getIdeaList();
  };
  getIdeaList = () => {
    TodoServices.listTodoByType(Todo.Idea)
      .then(res => {
        let temp = [];
        // console.log('IdeaList:', res);
        res.map(item => {
          temp.push(Object.assign(item, { key: item.Id }));
        });
        // console.log('tempList:', temp);
        this.setState({
          ideaList: temp,
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
    // console.log(selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };

  onChangePage = page => {
    //console.log('page:', page);
    this.setState({ pagination: page });
  };

  onClickShowDialog = type => {
    this.setState({ isShowDialog: true, dialogType: type });
  };

  onHideDialog = () => {
    this.setState({ isShowDialog: false });
  };

  confirm = () => {
    this.setState({ tableloading: true });
    TodoServices.deleteTodo(this.state.selectedRowKeys[0])
      .then(res => {
        // console.log('DETELEres:', res);
        switch (res) {
          case 0:
            message.success('Deleted successfully.');
            this.getIdeaList();
            break;
          case 2:
            message.error('Failed, please refresh or try again later.');
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
      <div>
        <CustomBreadcrumb primaryHeading="todo" secondaryHeading="ideaList" />

        <div className="flex-row margin-bottom-l">
          <Button type="primary" icon={<PlusSquareOutlined />} onClick={this.onClickShowDialog.bind(this, DialogType.Create)}>
            Create inspiration
          </Button>
          <span className="margin-left-m" />
          <Button icon={<EditOutlined />} disabled={this.state.selectedRowKeys?.length != 1} onClick={this.onClickShowDialog.bind(this, DialogType.Edit)}>
            Edit
          </Button>
          <span className="margin-left-m" />
          <Popconfirm title="Are you sure to delete this inspiration?" onConfirm={this.confirm} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} disabled={this.state.selectedRowKeys?.length != 1}>
              Delete
            </Button>
          </Popconfirm>
        </div>

        <Table columns={this.columns} dataSource={this.state.ideaList} loading={this.state.tableLoading} rowSelection={rowSelection} pagination={this.state.pagination} onChange={this.onChangePage} />
        {this.state.isShowDialog && <DialogIdea ideadata={this.state.selectedRows[0]} dialogType={this.state.dialogType} isShowDialog={this.state} onHideDialog={this.onHideDialog} getIdeaList={this.getIdeaList} />}
      </div>
    );
  }
}

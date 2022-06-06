/*
 * Author: Kristen.Qi
 * Version: KMS 1.0
 * Created Date: 2022-03-30
 */
import React, { Component } from 'react';
import CustomBreadcrumb from '../../CommonComponents/CustomBreadcrumb';
import { Table, Tag, Tooltip, Button, notification, Popconfirm, message, Popover } from 'antd';
import * as TodoServices from '../../Services/PackageServices/TodoServices';
import '../../CommonComponents/commonCss.css';
import { EditOutlined, DeleteOutlined, EyeOutlined, PlusSquareOutlined, CheckOutlined } from '@ant-design/icons';
import { DialogType, Todo } from '../../Services/EnumValue';
import DialogTodo from './DialogTodo';
import PreviewTodo from './PreviewTodo';

export default class TodoList extends Component {
  constructor() {
    super();
    this.state = {
      todoList: [],
      tableLoading: true,
      pagination: {
        current: 1,
        pageSize: 5,
      },
      selectedRowKeys: [],
      selectedRows: [],
      isShowPreview: false,
      isShowDialog: false,
      dialogType: DialogType.Create,
    };
    this.columns = this.initColumns();
  }

  initColumns = () => {
    return [
      {
        title: 'To-do',
        dataIndex: 'TodoTopic',
        render: text => <a>{text}</a>,
        ellipsis: { showTitle: false },
        width: 200,
        render: text => (
          <Tooltip placement="topLeft" title={text}>
            <a>{text}</a>
          </Tooltip>
        ),
      },
      Table.EXPAND_COLUMN,
      {
        title: 'Execution Date',
        dataIndex: 'Data',
        align: 'center',
        ellipsis: true,
        sorter: (a, b) => Date.parse(a.Data) - Date.parse(b.Data),
        render: a => <>{a}</>,
      },
      {
        title: 'Type',
        dataIndex: 'TodoType',
        align: 'center',
        render: data => <>{data === Todo.FreeTime ? 'Free' : 'Fixed'}</>,
        width: 85,
        filters: [
          { text: 'Free', value: Todo.FreeTime },
          { text: 'Fixed', value: Todo.NoFreeTime },
        ],
        onFilter: (value, record) => record.TodoType == value,
      },
      {
        title: 'Status',
        dataIndex: 'isComplete',
        align: 'center',
        width: 85,
        filters: [
          { text: 'Done', value: true },
          { text: 'UnDone', value: false },
        ],
        onFilter: (value, record) => record.isComplete == value,
        render: tags => <Tag color={tags ? 'green' : 'red'}>{tags ? 'Done' : 'UnDone'}</Tag>,
      },
    ];
  };

  componentDidMount = () => {
    this.getTodoList();
  };

  getTodoList = async () => {
    await TodoServices.listTodoUnlessIdea()
      .then(res => {
        // console.log('TodoList:', res);
        let temp = [];
        res.map(item => {
          temp.push(
            Object.assign(item, {
              key: item.Id,
              Data: this.displayTimeOrDate(item.DateFrom, item.DateTo, item.TodoType),
              //plan: item.PlanId? this.displayPlanName(item.Id):null,
            })
          );
        });
        // console.log('temp:', temp);
        this.setState({
          todoList: temp,
          tableLoading: false,
          selectedRows: [],
          selectedRowKeys: [],
        });

        // temp.map((item, key) => {
        //   if (item.PlanId) {
        //     TodoServices.getPlan(item.Id).then(name => {
        //       temp[key].plan = name.PlanTopic;
        //       console.log('temp2', temp);
        //       this.setState({
        //         todoList: temp,
        //         tableLoading: false,
        //         selectedRows: [],
        //         selectedRowKeys: [],
        //       });
        //     });
        //   }
        //   this.setState({
        //     todoList: temp,
        //     tableLoading: false,
        //     selectedRows: [],
        //     selectedRowKeys: [],
        //   });
        // });
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

  displayTimeOrDate = (dateFrom, dateTo, type) => {
    let data = '';
    let dataDate = new Date(dateFrom).toLocaleDateString();
    if (type === Todo.FreeTime) {
      data = dataDate;
    } else {
      let timeFrom = new Date(dateFrom).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let timeTo = new Date(dateTo).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      data = dataDate + ' ' + timeFrom + '--' + timeTo;
    }
    // console.log(data);
    return data;
  };

  displayPlanName = id => {
    return TodoServices.getPlan(id).then(res => {
      // console.log('GETPlan:', res);
      // callback(res.PlanTopic)
      return res.PlanTopic;
    });
    //return name;
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    // console.log(`selectkeys:${selectedRowKeys},selectrowa:${selectedRows}`);
    // console.log(selectedRows);
    this.setState({ selectedRowKeys, selectedRows });
  };

  onChangePage = page => {
    // console.log('page:', page);
    this.setState({ pagination: page });
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
  onComplete = () => {
    //  console.log(this.state.selectedRowKeys[0])
    TodoServices.completeTodo(this.state.selectedRowKeys[0])
      .then(res => {
        // console.log('CREATEres:', res);
        switch (res) {
          case 0:
            message.success('Well Done! You are one step closer to your dream.');
            this.getTodoList();
            break;
          case 706:
            message.error('This type is not support complete.');
            break;
          case 2:
            message.error('Failed to update data, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };
  onConfirm = () => {
    TodoServices.deleteTodo(this.state.selectedRowKeys[0])
      .then(res => {
        // console.log('CREATEres:', res);
        switch (res) {
          case 0:
            message.success('Deleted successfully.');
            this.getTodoList();
            break;

          case 2:
            message.error('Failed to update data, please refresh or try again later.');
            break;
          default:
            message.error('An unknown error occurred, please refresh or try again later.');
            break;
        }
      })
      .catch(err => {
        console.log('Fetch error:%S', err);
        message.error('There is an exception in the interface connection, please refresh or try again later.');
      });
  };

  render() {
    const rowSelection = { selectedRowKeys: this.state.selectedRowKeys, onChange: this.onSelectChange };

    return (
      <div id="todo-list">
        <CustomBreadcrumb primaryHeading="todo" secondaryHeading="todoList" />

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
          <Popconfirm title="Are you sure to delete the to-do?" onConfirm={this.onConfirm} okText="Yes" cancelText="No">
            <Button icon={<DeleteOutlined />} disabled={this.state.selectedRowKeys?.length != 1}>
              Delete
            </Button>
          </Popconfirm>
          <span className="margin-left-m" />
          <Button type="primary" icon={<CheckOutlined />} disabled={this.state.selectedRowKeys?.length != 1 || this.state.selectedRows[0]?.isComplete} onClick={this.onComplete}>
            Complete to-do
          </Button>
        </div>
        <Table
          columns={this.columns}
          dataSource={this.state.todoList}
          loading={this.state.tableLoading}
          rowSelection={rowSelection}
          pagination={this.state.pagination}
          onChange={this.onChangePage}
          expandable={{
            expandedRowRender: record => (
              <>
                <p style={{ margin: 0 }}>Details : {record.TodoItem}</p>
              </>
            ),
          }}
        />
        {this.state.isShowPreview && <PreviewTodo todoData={this.state.selectedRows} onHidePreview={this.onHidePreview} isShowPreview={this.state.isShowPreview} />}
        {this.state.isShowDialog && <DialogTodo todoData={this.state.selectedRows[0]} dialogType={this.state.dialogType} isShowDialog={this.state.isShowDialog} onHideDialog={this.onHideDialog} getTodoList={this.getTodoList} />}
      </div>
    );
  }
}

import moment from 'moment';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {ActionType, ModalForm, PageContainer, ProFormText, ProFormTextArea, ProTable} from '@ant-design/pro-components';
import {Button, Input, Spin} from 'antd';
import React, {useRef, useState} from "react";
import {FormattedMessage, useIntl} from "@@/exports";
import NewTaskForm from './components/NewTaskForm';
import DescribeTaskForm from "./components/DescribeTaskForm";
import { v4 as uuidv4 } from 'uuid';

const valueEnum = {
  0: 'running',
  1: 'success',
  2: 'fail',
};

export type TableListItem = {
  key: number;
  taskId: string;
  createdAt: number;
  status: string;
};
const tableListDataSource: TableListItem[] = [];

// 生成 mock 数据
for (let i = 0; i < 20; i += 1) {
  tableListDataSource.push({
    key: i,
    taskId: uuidv4(),
    status: valueEnum[Math.floor(Math.random() * 10) % 3],
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
  });
}

const TextToSpeech: React.FC = () => {
  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建任务窗口的弹窗
   *  */
  const [newTaskModalOpen, handleNewTaskModalOpen] = useState<boolean>(false);

  /**
   * @en-US Pop-up window of new window
   * @zh-CN 新建任务窗口的弹窗
   */
  const [describeTaskModalOpen, handleDescribeTaskModalOpen] = useState<boolean>(false);

  const actionRef = useRef<ActionType>();

  const [loading, setLoading] = useState(false);
  const [currentTask, setCurrentTask] = useState<API.TextToSpeechTaskItem>()

  const handleDescribeTaskModal = ({record}: { record: TableListItem }) => {
    setLoading(true)
    handleDescribeTaskModalOpen(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentTask({
        taskId: record.taskId,
        createdAt: moment(new Date(record.createdAt)).format('YYYY-MM-DD HH:mm:ss'),
        completedAt: record.status === "running" ? "" : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        status: record.status,
        result: record.status === "success" ? "this is a success result." : record.status === "fail" ? "this is a fail reason" : ""
      })
    }, 2000);
  };

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '排序',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 48,
    },
    {
      title: '任务单号',
      dataIndex: 'taskId',
      width: 500,
      render: (text, record) => (
        <a onClick={() => handleDescribeTaskModal({record: record})}>{text}</a>
      ),
      // 自定义筛选项功能具体实现请参考 https://ant.design/components/table-cn/#components-table-demo-custom-filter-panel
      filterDropdown: () => (
        <div style={{ padding: 8 }}>
          <Input style={{ width: 188, marginBlockEnd: 8, display: 'block' }} />
        </div>
      ),
      filterIcon: (filtered) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueEnum: {
        running: { text: '运行中', status: 'Processing' },
        success: { text: '成功', status: 'Success' },
        fail: { text: '失败', status: 'Error' },
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTime',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      valueType: 'dateTimeRange',
      hideInTable: true,
      search: {
        transform: (value) => {
          return {
            startTime: value[0],
            endTime: value[1],
          };
        },
      },
    },
  ];

  return (
    <PageContainer>
      <ProTable<TableListItem>
        actionRef={actionRef}
        columns={columns}
        request={(params, sorter, filter) => {
          // 表单搜索项会从 params 传入，传递给后端接口。
          console.log(params, sorter, filter);
          return Promise.resolve({
            data: tableListDataSource,
            success: true,
          });
        }}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
        }}
        search={{
          layout: 'vertical',
          defaultCollapsed: true,
        }}
        dateFormatter="string"
        toolbar={{
          title: '文字转音频任务列表',
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleNewTaskModalOpen(true);
            }}
          >
            <PlusOutlined /> 创建任务
          </Button>,
        ]}
      />

      { /* 创建任务 */ }
      <NewTaskForm
        open={newTaskModalOpen}
        onOpenChange={handleNewTaskModalOpen}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.RuleListItem);
          if (success) {
            handleNewTaskModalOpen(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
      />

      { /* 展示任务详情 */ }
      <DescribeTaskForm
        open={describeTaskModalOpen}
        onOpenChange={handleDescribeTaskModalOpen}
        value={currentTask || {}}
        loading={loading}
      />

    </PageContainer>
  );
};


export default TextToSpeech;

import { listTextToSpeechTasks } from '@/services/ant-design-pro/api';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, Input } from 'antd';
import moment from 'moment';
import React, { useRef, useState } from 'react';
import DescribeTaskForm from './components/DescribeTaskForm';
import NewTaskForm from './components/NewTaskForm';

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
  const [currentTask, setCurrentTask] = useState<API.TextToSpeechTaskItem>();

  const handleDescribeTaskModal = ({ record }: { record: API.TableListItem }) => {
    setLoading(true);
    handleDescribeTaskModalOpen(true);
    setTimeout(() => {
      setLoading(false);
      setCurrentTask({
        taskId: record.taskId,
        createdAt: moment(new Date(record.createdAt)).format('YYYY-MM-DD HH:mm:ss'),
        completedAt:
          record.status === 'running' ? '' : moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
        status: record.status,
        result:
          record.status === 'success'
            ? 'this is a success result.'
            : record.status === 'fail'
            ? 'this is a fail reason'
            : '',
      });
    }, 2000);
  };

  const columns: ProColumns<API.TableListItem>[] = [
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
        <a onClick={() => handleDescribeTaskModal({ record: record })}>{text}</a>
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
      <ProTable<API.TableListItem>
        actionRef={actionRef}
        columns={columns}
        request={(params) => listTextToSpeechTasks({ ...params })}
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

      {/* 创建任务 */}
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

      {/* 展示任务详情 */}
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

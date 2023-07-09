import { AudioOutlined } from '@ant-design/icons';
import { ModalForm } from '@ant-design/pro-form';
import { Badge, Descriptions, Spin } from 'antd';
import moment from 'moment';
import React from 'react';

export type DescribeTaskFormProps = {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  value: Partial<API.TextToSpeechTaskItem>;
  loading: boolean;
};

type StatusMap = {
  [key: string]: {
    status: 'processing' | 'success' | 'error';
    text: string;
  };
};

const statusMap: StatusMap = {
  running: {
    status: 'processing',
    text: '运行中',
  },
  success: {
    status: 'success',
    text: '成功',
  },
  fail: {
    status: 'error',
    text: '失败',
  },
};

const DescribeTaskForm: React.FC<DescribeTaskFormProps> = (props: DescribeTaskFormProps) => {
  const statusItem = statusMap[props.value.status ? props.value.status : 'running'];

  return (
    <ModalForm<{
      name: string;
      company: string;
    }>
      title={
        <span>
          <AudioOutlined />
          {' 工单详情'}
        </span>
      }
      open={props.open}
      onOpenChange={props.onOpenChange}
      autoFocusFirstInput
      submitter={false}
    >
      {props.loading ? (
        <div style={{ textAlign: 'center' }}>
          <Spin />
        </div>
      ) : (
        <Descriptions bordered column={2}>
          <Descriptions.Item label="任务单号" span={2}>
            {props.value.taskId}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间" span={1}>
            {moment(parseInt(props.value.createdAt as string)).format('YYYY-MM-DD HH:mm:ss')}
          </Descriptions.Item>
          <Descriptions.Item label="完成时间" span={1}>
            {props.value.completedAt !== ''
              ? moment(parseInt(props.value.completedAt as string)).format('YYYY-MM-DD HH:mm:ss')
              : ''}
          </Descriptions.Item>
          <Descriptions.Item label="状态" span={2}>
            <Badge status={statusItem.status} text={statusItem.text} />
          </Descriptions.Item>
          <Descriptions.Item label="输入文本" span={2}>
            {props.value.input}
          </Descriptions.Item>
          <Descriptions.Item label="任务结果" span={2}>
            {statusItem.status === 'success' ? (
              <a href={'tts_result/' + props.value.result} download>
                点击下载
              </a>
            ) : statusItem.status === 'error' ? (
              props.value.result
            ) : (
              ''
            )}
          </Descriptions.Item>
        </Descriptions>
      )}
    </ModalForm>
  );
};

export default DescribeTaskForm;

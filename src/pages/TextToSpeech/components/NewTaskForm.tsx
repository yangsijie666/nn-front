import { FormattedMessage } from '@@/exports';
import { CommentOutlined } from '@ant-design/icons';
import { ModalForm, ProFormTextArea } from '@ant-design/pro-components';
import React from 'react';

export type NewTaskFormProps = {
  open: boolean;
  onOpenChange: (visible: boolean) => void;
  onFinish: (text: string) => Promise<void>;
};

const NewTaskForm: React.FC<NewTaskFormProps> = (props: NewTaskFormProps) => {
  return (
    <ModalForm
      title={
        <span>
          <CommentOutlined />
          {'  '}
          <FormattedMessage
            id="pages.searchTable.createForm.newTextToSpeechTask"
            defaultMessage="New TextToSpeech task"
          />
        </span>
      }
      width="600px"
      open={props.open}
      onOpenChange={props.onOpenChange}
      onFinish={props.onFinish}
    >
      <ProFormTextArea
        rules={[
          {
            required: true,
            message: (
              <FormattedMessage
                id="pages.searchTable.createForm.newTextToSpeechTaskName"
                defaultMessage="Text is required"
              />
            ),
          },
        ]}
        // width="md"
        name="textToSpeechInput"
        placeholder="请输入需要转语音的文字内容"
        fieldProps={{
          allowClear: true,
          showCount: true,
          autoSize: {
            minRows: 7,
          },
        }}
        style={{ width: '100%' }}
      />
    </ModalForm>
  );
};

export default NewTaskForm;

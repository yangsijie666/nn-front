import { Request, Response } from 'express';
import moment from 'moment/moment';
import { v4 as uuidv4 } from 'uuid';

const valueEnum: {
  [key: number]: string;
} = {
  0: 'running',
  1: 'success',
  2: 'fail',
};

const genList = (current: number, pageSize: number) => {
  const tableListDataSource: API.TextToSpeechTaskItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    let s = valueEnum[Math.floor(Math.random() * 10) % 3];
    tableListDataSource.push({
      taskId: uuidv4(),
      status: s,
      createdAt: (Date.now() - Math.floor(Math.random() * 100000)).toString(),
      completedAt: s != 'running' ? Date.now().toString() : '',
      input: 'this is a mock input',
      result: s == 'running' ? '' : s == 'success' ? 'test.nnn' : 'thist is a fail reason',
    });
  }
  tableListDataSource.sort((a, b) => parseInt(b.createdAt) - parseInt(a.createdAt));
  return tableListDataSource;
};

let tableListDataSource = genList(1, 100);

function listTasks(req: Request, res: Response, u: string) {
  let realUrl = u;
  if (!realUrl || Object.prototype.toString.call(realUrl) !== '[object String]') {
    realUrl = req.url;
  }

  let dataSource = [...tableListDataSource];
  const { current, pageSize, taskId, status, startTime, endTime } = req.body;

  if (taskId) {
    dataSource = dataSource.filter((data) => data.taskId === taskId);
  }
  if (status) {
    dataSource = dataSource.filter((data) => data.status === status);
  }
  if (startTime && endTime) {
    let start = moment(startTime, 'YYYY-MM-DD HH:mm:ss');
    let end = moment(endTime, 'YYYY-MM-DD HH:mm:ss');
    console.log(dataSource);
    dataSource = dataSource.filter(
      (data) =>
        start.unix() * 1000 <= parseInt(data.createdAt) &&
        parseInt(data.createdAt) <= end.unix() * 1000,
    );
  }

  let total = dataSource.length;
  let data = [...dataSource]
    .slice(
      ((current as number) - 1) * (pageSize as number),
      (current as number) * (pageSize as number),
    )
    .map(
      (item): API.TableListItem =>
        <API.TableListItem>{
          taskId: item.taskId,
          createdAt: parseInt(item.createdAt),
          status: item.status,
        },
    );

  const result = {
    data: data,
    total: total,
    success: true,
    pageSize,
    current: current,
  };

  return res.json(result);
}

function describeTask(req: Request, res: Response, u: string) {
  const { task_id } = req.query;
  let taskId = task_id;
  const task = tableListDataSource.find((item) => item.taskId === taskId);
  if (task === undefined) {
    let result: API.DescribeTextToSpeechTaskResponse = {
      success: false,
      errorCode: 'TASK NOT FOUND',
      errorMessage: 'task not found -' + taskId,
    };
    setTimeout(() => {}, Math.floor(Math.random() * 100));
    return res.json(result);
  }

  let result: API.DescribeTextToSpeechTaskResponse = {
    success: true,
    data: task,
  };
  setTimeout(() => {}, Math.floor(Math.random() * 100));

  return res.json(result);
}

function addTask(req: Request, res: Response, u: string) {
  const { text } = req.body;
  let taskId = uuidv4();
  tableListDataSource.unshift({
    taskId: taskId,
    status: 'running',
    createdAt: Date.now().toString(),
    input: text,
  });

  let result: API.AddTextToSpeechTaskResponse = {
    success: true,
    data: taskId,
  };

  return res.json(result);
}

export default {
  'POST /api/textToSpeech/list': listTasks,
  'GET /api/textToSpeech/describe': describeTask,
  'POST /api/textToSpeech/add': addTask,
};

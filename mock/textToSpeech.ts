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
  const tableListDataSource: API.TableListItem[] = [];

  for (let i = 0; i < pageSize; i += 1) {
    const index = (current - 1) * 10 + i;
    tableListDataSource.push({
      key: index,
      taskId: uuidv4(),
      status: valueEnum[Math.floor(Math.random() * 10) % 3],
      createdAt: Date.now() - Math.floor(Math.random() * 2000),
    });
  }
  tableListDataSource.reverse();
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
    dataSource = dataSource.filter(
      (data) => start.unix() <= data.createdAt && data.createdAt <= end.unix(),
    );
  }

  let total = dataSource.length;
  dataSource = [...dataSource].slice(
    ((current as number) - 1) * (pageSize as number),
    (current as number) * (pageSize as number),
  );

  const result = {
    data: dataSource,
    total: total,
    success: true,
    pageSize,
    current: current,
  };

  return res.json(result);
}

export default {
  'POST /textToSpeech/list': listTasks,
};

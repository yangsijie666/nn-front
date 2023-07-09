# Ant Design Pro

This project is initialized with [Ant Design Pro](https://pro.ant.design). Follow is the quick guide for how to use.

## 依赖

nodejs v16.20.0

## 开发 mock 环境启动

在系统根目录下执行：

```shell
npm install tyarn -g && tyarn
npm run start
```

## 构建生产环境容器并使用

1. 更新 `deploy/nginx.conf` 中的 `proxy_pass` 为后端服务地址，例如：
   ```text
   proxy_pass http://127.0.0.1:8080;
   ```
2. 构建生产环境容器
   ```shell
   docker build -f deploy/Dockerfile -t nn-front:prod-v1 .
   ```
3. 运行生产环境容器：

```shell
docker run -itd --name nn -p 8080:80 -v ./deploy/nginx.conf:/etc/nginx/conf.d/default.conf  nn-front:prod-v1
```

## Environment Prepare

Install `node_modules`:

```bash
npm install
```

or

```bash
yarn
```

## Provided Scripts

Ant Design Pro provides some useful script to help you quick start and build with web project, code style check and test.

Scripts provided in `package.json`. It's safe to modify or add additional script:

### Start project

```bash
npm start
```

### Build project

```bash
npm run build
```

### Check code style

```bash
npm run lint
```

You can also use script to auto fix some lint error:

```bash
npm run lint:fix
```

### Test code

```bash
npm test
```

## More

You can view full document on our [official website](https://pro.ant.design). And welcome any feedback in our [github](https://github.com/ant-design/ant-design-pro).

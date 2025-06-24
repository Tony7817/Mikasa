# Quasar App (Mikasa)

A website for E-P platform.

## Install the dependencies

```bash
yarn
# or
npm install
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn lint
# or
npm run lint
```

### Format the files

```bash
yarn format
# or
npm run format
```

### Build the app for production

```bash
quasar build

scp -r ./dist/spa/* root@xxxx:/data/index/spa/
```

### Customize the configuration

See [Configuring quasar.config.js](https://v2.quasar.dev/quasar-cli-vite/quasar-config-js).

# 开发规范
## 接口
- 前端声明变量是时要定义接口，然后使用lodash的_.assign方法进行赋值
- 开发需求前要写好全流程的设计文档和逻辑文档，有流程图输出
- 变量连接均使用下划线表示

### Deploy
sudo git pull
sudo yarn quasar build
sudo rm -r /var/www/lureros/* && sudo cp -r dist/spa/* /var/www/lureros/

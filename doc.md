# 更新逻辑

```mermaid
graph TD;
    A[watch file绑定的值是否已修改] --> B[提交时判断如果修改，则上传阿里云，同时删除以往图片]
```

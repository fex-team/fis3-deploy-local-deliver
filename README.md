# fis3-deploy-local-deliver

## 说明

FIS 默认的部署插件，提供本地部署

## 使用方法

也可以使用统一的 deploy 插件配置方法

```js
fis.match('*.js', {
    deploy: fis.plugin('local-deliver', {
        to: './output'
    })
})
```

# fis3-deploy-local-deliver

## 说明

FIS 默认的部署插件，提供本地部署

## 使用方法

也可以使用统一的 deploy 插件配置方法

```js
fis.match('*.js', {
    deploy: fis.plugin('local-deliver', {
        to: './output',
        //支持对文件进行字符串替换
        replace : {
            from : 'http://www.online.com',
            to : 'http://www.offline.com'
        }
    })
})
```

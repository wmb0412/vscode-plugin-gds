gds地址：https://demo.guandata.com/gds/develop/design-tokens
# 演示
1. 自动补全 & 输入颜色自动匹配
    ![demo img](/src/resources/completion.gif)
2. 悬浮提示  & 颜色标记 颜色=> token， token=>颜色
    ![demo img](/src/resources/hover.gif)
3. in tsx
    ![demo img](/src/resources/tsx.gif)
4. 文件夹/文件一键匹配
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/33.gif?raw=true)
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/123.gif?raw=true)
# 配置
    插件默认使用[node_modules\/@guandata\/gds\/scss\/light\/_colors.scss, node_modules\/@guandata\/gds\/scss\/light\/_utils.scss]地址。可以通过以下配置修改
    在setting文件中配置 
```json
        scssToken : {
            global: [fileUrl1,fileUrl2, node_modules\/@guandata\/gds\/scss\/light\/_colors.scss]
        }
```
# 缺陷
    1. 不支持透明度rgba
    2. 不支持二次引用scss变量的token($color-temp)
    3. 一键匹配未精确到属性。如background-color: #fff; 应匹配$color-background-alt而不是$color-text-inverse

gds地址：https://demo.guandata.com/gds/develop/design-tokens
# 演示
1. 在scss文件中输入rgb或者hex颜色自动匹配guandata/gds（可配置）
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/141646730313_.pic.jpg?raw=true)
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/131646730290_.pic.jpg?raw=true)
2. 自动补全
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/1.pic.jpg?raw=true)
3. 悬浮提示 颜色=> token， token=>颜色
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/121646730180_.pic.jpg?raw=true)
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/111646730158_.pic.jpg?raw=true)
4. 文件夹/文件一键匹配
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/33.gif?raw=true)
    ![demo img](https://github.com/wmb0412/vscode-plugin-gds/blob/master/src/resources/123.gif?raw=true)
# 配置
    插件默认使用node_modules\/@guandata\/gds\/scss\/light\/_colors.scss地址。可以通过以下配置修改
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

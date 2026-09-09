---
layout: home

hero:
  name: Shirone-Admin
  text: Shirone 博客的可视化内容管理工具
  tagline: 本地单机运行 · AI 辅助写作 · 一键双仓发布——从安装上手到 API 查阅，这里是你了解它的第一站
  image:
    src: /assets/image/home/blog.svg
    alt: Shirone-Admin
  actions:
    - theme: brand
      text: 快速上手
      link: /zh/guide/
    - theme: alt
      text: GitHub
      link: https://github.com/bobokaka/Shirone-Admin

features:
  - title: 文章编辑
    icon: '<i class="fa-solid fa-file-pen"></i>'
    details: Markdown 源码模式编辑器，内置 Shirone 主题私有扩展片段（三冒号容器、file-tree、代码标签页等），配图随文管理
  - title: 说说与动态
    icon: '<i class="fa-solid fa-comment-dots"></i>'
    details: 动态发布与管理，图片自动归档到主题缩略图管线目录
  - title: 结构化数据
    icon: '<i class="fa-solid fa-table-list"></i>'
    details: 项目、技能、时间线、设备、番剧、导航等 data/*.ts 可视化编辑
  - title: AI 助手
    icon: '<i class="fa-solid fa-robot"></i>'
    details: 多服务商配置切换，辅助内容导入改写、提交信息生成、时间线起草
  - title: 内容导入
    icon: '<i class="fa-solid fa-file-import"></i>'
    details: 简书导出包、番剧（Bangumi API）、音乐一站式导入
  - title: 一键发布
    icon: '<i class="fa-solid fa-rocket"></i>'
    details: 双仓 git 提交与推送，发布前自动执行主题校验

highlights:
  - header: 为什么选择 Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 本地优先
        icon: fa-house-laptop
        details: 数据全部保存在你自己的内容仓，单机运行，无需部署服务端
      - title: 真站预览
        icon: fa-eye
        details: 内嵌主题仓 astro dev 实时预览，所见即即将发布的真实站点
      - title: 三仓协作
        icon: fa-cubes
        details: 与 Shirone 主题仓、Shirone-Content 内容仓各司其职，改动来源清晰可追溯
      - title: 安全发布
        icon: fa-shield-halved
        details: 发布前自动执行主题校验，失败即阻断，杜绝坏内容上线

  - header: 三分钟启动
    image: /assets/image/home/box.svg
    bgImage: /assets/image/home/bg/2-light.svg
    bgImageDark: /assets/image/home/bg/2-dark.svg
    highlights:
      - 将 Shirone、Shirone-Content、Shirone-Admin 三个仓库克隆到同一父目录
      - 在 Shirone-Admin 与 Shirone 仓库分别执行 pnpm install
      - 运行 node workspace/content-watch.mjs 一键启动全部服务
      - 浏览器访问 http://localhost:5173 进入管理后台
      - 详细步骤与进阶用法见指南章节
---

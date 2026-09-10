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
  - title: 仪表盘与真站预览
    icon: '<i class="fa-solid fa-gauge-high"></i>'
    details: 待发布变更与内容统计一目了然，内嵌真实博客的实时预览面板
    link: /zh/guide/dashboard
  - title: 文章编辑
    icon: '<i class="fa-solid fa-pen-nib"></i>'
    details: Markdown 源码编辑器，内置三冒号容器、file-tree 等主题扩展片段，配图随文管理
    link: /zh/guide/post-editor
  - title: 说说动态
    icon: '<i class="fa-solid fa-messages"></i>'
    details: 心情、地点、标签与九宫格配图，图片自动归档到主题缩略图管线
    link: /zh/guide/moments
  - title: 站点设置
    icon: '<i class="fa-solid fa-palette"></i>'
    details: 基础信息、导航、页脚、主题外观与横幅壁纸，全部可视化调整
    link: /zh/guide/settings
  - title: 结构化数据
    icon: '<i class="fa-solid fa-diagram-project"></i>'
    details: 项目、技能、时间线、设备、番剧、罗盘、歌单、友链可视化编辑，支持搜索导入
    link: /zh/guide/data
  - title: AI 助手
    icon: '<i class="fa-solid fa-wand-magic-sparkles"></i>'
    details: 多服务商自由切换，内容改写、提交信息生成、时间线起草全站可用
    link: /zh/guide/ai
  - title: 内容导入
    icon: '<i class="fa-solid fa-cloud-arrow-down"></i>'
    details: 简书导出包整批迁移、单篇粘贴即贴即转，番剧与音乐一站式导入
    link: /zh/guide/import
  - title: 一键发布
    icon: '<i class="fa-solid fa-rocket-launch"></i>'
    details: 双仓 git 提交与推送，发布前自动执行主题校验，失败即阻断
    link: /zh/guide/publish

highlights:
  - header: 为什么选择 Shirone-Admin
    image: /assets/image/home/diamond.svg
    bgImage: /assets/image/home/bg/1-light.svg
    bgImageDark: /assets/image/home/bg/1-dark.svg
    features:
      - title: 本地优先
        icon: fa-hard-drive
        details: 数据全部保存在你自己的内容仓，单机运行，无需部署服务端
      - title: 真站预览
        icon: fa-window-maximize
        details: 内嵌主题仓 astro dev 实时预览，所见即即将发布的真实站点
      - title: 三仓协作
        icon: fa-cubes
        details: 与 Shirone 主题仓、Shirone-Content 内容仓各司其职，改动来源清晰可追溯
      - title: 安全发布
        icon: fa-clipboard-check
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

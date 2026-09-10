import type { DefaultTheme } from "vitepress";

type SidebarConfig = DefaultTheme.Sidebar;

// 侧边栏配置：key 为带语言前缀的目录路径，value 为该目录的侧边栏数组。
// 新增文档后在此处（或通过脚本）补充对应语言的条目。
export const sidebar: SidebarConfig = {
  "/zh/guide/": [
    {
      text: "开始",
      items: [
        { text: "指南总览", link: "/zh/guide/" },
        { text: "快速上手", link: "/zh/guide/quick-start" },
        { text: "三仓工作区", link: "/zh/guide/workspace" },
      ],
    },
    {
      text: "内容创作",
      items: [
        { text: "仪表盘与预览", link: "/zh/guide/dashboard" },
        { text: "文章管理", link: "/zh/guide/posts" },
        { text: "文章编辑", link: "/zh/guide/post-editor" },
        { text: "说说动态", link: "/zh/guide/moments" },
      ],
    },
    {
      text: "站点定制",
      items: [
        { text: "站点设置", link: "/zh/guide/settings" },
        { text: "结构化数据", link: "/zh/guide/data" },
      ],
    },
    {
      text: "进阶",
      items: [
        { text: "平台导入", link: "/zh/guide/import" },
        { text: "AI 助手", link: "/zh/guide/ai" },
        { text: "提交和发布", link: "/zh/guide/publish" },
      ],
    },
  ],
  "/zh/api/": [
    {
      text: "开始",
      items: [{ text: "API 总览", link: "/zh/api/" }],
    },
    {
      text: "端点参考",
      items: [
        { text: "系统与预览", link: "/zh/api/system" },
        { text: "文章", link: "/zh/api/posts" },
        { text: "说说", link: "/zh/api/moments" },
        { text: "媒体上传", link: "/zh/api/media" },
        { text: "站点设置", link: "/zh/api/settings" },
        { text: "结构化数据", link: "/zh/api/data" },
        { text: "发布与校验", link: "/zh/api/publish" },
        { text: "AI 服务", link: "/zh/api/ai" },
        { text: "简书导入", link: "/zh/api/import" },
      ],
    },
  ],
  "/en/guide/": [
    {
      text: "Getting Started",
      items: [
        { text: "Guide", link: "/en/guide/" },
        { text: "Quick Start", link: "/en/guide/quick-start" },
        { text: "Three-Repo Workspace", link: "/en/guide/workspace" },
      ],
    },
    {
      text: "Content Creation",
      items: [
        { text: "Dashboard & Preview", link: "/en/guide/dashboard" },
        { text: "Post Management", link: "/en/guide/posts" },
        { text: "Post Editing", link: "/en/guide/post-editor" },
        { text: "Moments", link: "/en/guide/moments" },
      ],
    },
    {
      text: "Site Customization",
      items: [
        { text: "Site Settings", link: "/en/guide/settings" },
        { text: "Structured Data", link: "/en/guide/data" },
      ],
    },
    {
      text: "Advanced",
      items: [
        { text: "Platform Import", link: "/en/guide/import" },
        { text: "AI Assistant", link: "/en/guide/ai" },
        { text: "Commit & Publish", link: "/en/guide/publish" },
      ],
    },
  ],
  "/en/api/": [
    {
      text: "Getting Started",
      items: [{ text: "API Overview", link: "/en/api/" }],
    },
    {
      text: "Endpoint Reference",
      items: [
        { text: "System & Preview", link: "/en/api/system" },
        { text: "Posts", link: "/en/api/posts" },
        { text: "Moments", link: "/en/api/moments" },
        { text: "Media Upload", link: "/en/api/media" },
        { text: "Site Settings", link: "/en/api/settings" },
        { text: "Structured Data", link: "/en/api/data" },
        { text: "Publish & Validation", link: "/en/api/publish" },
        { text: "AI Services", link: "/en/api/ai" },
        { text: "Jianshu Import", link: "/en/api/import" },
      ],
    },
  ],
  "/ja/guide/": [
    {
      text: "はじめに",
      items: [
        { text: "ガイド", link: "/ja/guide/" },
        { text: "クイックスタート", link: "/ja/guide/quick-start" },
        { text: "3リポジトリワークスペース", link: "/ja/guide/workspace" },
      ],
    },
    {
      text: "コンテンツ作成",
      items: [
        { text: "ダッシュボードとプレビュー", link: "/ja/guide/dashboard" },
        { text: "記事管理", link: "/ja/guide/posts" },
        { text: "記事編集", link: "/ja/guide/post-editor" },
        { text: "モーメンツ", link: "/ja/guide/moments" },
      ],
    },
    {
      text: "サイトカスタマイズ",
      items: [
        { text: "サイト設定", link: "/ja/guide/settings" },
        { text: "構造化データ", link: "/ja/guide/data" },
      ],
    },
    {
      text: "さらに詳しく",
      items: [
        { text: "プラットフォームからの取り込み", link: "/ja/guide/import" },
        { text: "AI アシスタント", link: "/ja/guide/ai" },
        { text: "コミットと公開", link: "/ja/guide/publish" },
      ],
    },
  ],
  "/ja/api/": [
    {
      text: "はじめに",
      items: [{ text: "API 概要", link: "/ja/api/" }],
    },
    {
      text: "エンドポイントリファレンス",
      items: [
        { text: "システムとプレビュー", link: "/ja/api/system" },
        { text: "記事", link: "/ja/api/posts" },
        { text: "モーメンツ", link: "/ja/api/moments" },
        { text: "メディアアップロード", link: "/ja/api/media" },
        { text: "サイト設定", link: "/ja/api/settings" },
        { text: "構造化データ", link: "/ja/api/data" },
        { text: "公開と検証", link: "/ja/api/publish" },
        { text: "AI サービス", link: "/ja/api/ai" },
        { text: "簡書取り込み", link: "/ja/api/import" },
      ],
    },
  ],
  "/ru/guide/": [
    {
      text: "Начало",
      items: [
        { text: "Руководство", link: "/ru/guide/" },
        { text: "Быстрый старт", link: "/ru/guide/quick-start" },
        { text: "Рабочее пространство из трёх репозиториев", link: "/ru/guide/workspace" },
      ],
    },
    {
      text: "Создание контента",
      items: [
        { text: "Дашборд и предпросмотр", link: "/ru/guide/dashboard" },
        { text: "Управление статьями", link: "/ru/guide/posts" },
        { text: "Редактирование статей", link: "/ru/guide/post-editor" },
        { text: "Моменты", link: "/ru/guide/moments" },
      ],
    },
    {
      text: "Настройка сайта",
      items: [
        { text: "Настройки сайта", link: "/ru/guide/settings" },
        { text: "Структурированные данные", link: "/ru/guide/data" },
      ],
    },
    {
      text: "Продвинутые темы",
      items: [
        { text: "Импорт с платформ", link: "/ru/guide/import" },
        { text: "ИИ-ассистент", link: "/ru/guide/ai" },
        { text: "Коммиты и публикация", link: "/ru/guide/publish" },
      ],
    },
  ],
  "/ru/api/": [
    {
      text: "Начало",
      items: [{ text: "Обзор API", link: "/ru/api/" }],
    },
    {
      text: "Справочник эндпоинтов",
      items: [
        { text: "Система и предпросмотр", link: "/ru/api/system" },
        { text: "Статьи", link: "/ru/api/posts" },
        { text: "Моменты", link: "/ru/api/moments" },
        { text: "Загрузка медиа", link: "/ru/api/media" },
        { text: "Настройки сайта", link: "/ru/api/settings" },
        { text: "Структурированные данные", link: "/ru/api/data" },
        { text: "Публикация и проверка", link: "/ru/api/publish" },
        { text: "ИИ-службы", link: "/ru/api/ai" },
        { text: "Импорт из Цзяньшу", link: "/ru/api/import" },
      ],
    },
  ],
  "/fr/guide/": [
    {
      text: "Premiers pas",
      items: [
        { text: "Guide", link: "/fr/guide/" },
        { text: "Démarrage rapide", link: "/fr/guide/quick-start" },
        { text: "L'espace de travail à trois dépôts", link: "/fr/guide/workspace" },
      ],
    },
    {
      text: "Création de contenu",
      items: [
        { text: "Tableau de bord et aperçu", link: "/fr/guide/dashboard" },
        { text: "Gestion des articles", link: "/fr/guide/posts" },
        { text: "Éditeur d'articles", link: "/fr/guide/post-editor" },
        { text: "Moments", link: "/fr/guide/moments" },
      ],
    },
    {
      text: "Personnalisation du site",
      items: [
        { text: "Paramètres du site", link: "/fr/guide/settings" },
        { text: "Données structurées", link: "/fr/guide/data" },
      ],
    },
    {
      text: "Aller plus loin",
      items: [
        { text: "Import depuis plateformes", link: "/fr/guide/import" },
        { text: "Assistant IA", link: "/fr/guide/ai" },
        { text: "Commit et publication", link: "/fr/guide/publish" },
      ],
    },
  ],
  "/fr/api/": [
    {
      text: "Premiers pas",
      items: [{ text: "Présentation de l'API", link: "/fr/api/" }],
    },
    {
      text: "Référence des endpoints",
      items: [
        { text: "Système et aperçu", link: "/fr/api/system" },
        { text: "Articles", link: "/fr/api/posts" },
        { text: "Moments", link: "/fr/api/moments" },
        { text: "Téléversement de médias", link: "/fr/api/media" },
        { text: "Paramètres du site", link: "/fr/api/settings" },
        { text: "Données structurées", link: "/fr/api/data" },
        { text: "Publication et validation", link: "/fr/api/publish" },
        { text: "Services IA", link: "/fr/api/ai" },
        { text: "Import Jianshu", link: "/fr/api/import" },
      ],
    },
  ],
  "/es/guide/": [
    {
      text: "Primeros pasos",
      items: [
        { text: "Guía", link: "/es/guide/" },
        { text: "Inicio rápido", link: "/es/guide/quick-start" },
        { text: "Espacio de trabajo de tres repositorios", link: "/es/guide/workspace" },
      ],
    },
    {
      text: "Creación de contenido",
      items: [
        { text: "Panel de control y vista previa", link: "/es/guide/dashboard" },
        { text: "Gestión de artículos", link: "/es/guide/posts" },
        { text: "Edición de artículos", link: "/es/guide/post-editor" },
        { text: "Momentos", link: "/es/guide/moments" },
      ],
    },
    {
      text: "Personalización del sitio",
      items: [
        { text: "Ajustes del sitio", link: "/es/guide/settings" },
        { text: "Datos estructurados", link: "/es/guide/data" },
      ],
    },
    {
      text: "Temas avanzados",
      items: [
        { text: "Importación desde plataformas", link: "/es/guide/import" },
        { text: "Asistente de IA", link: "/es/guide/ai" },
        { text: "Commit y publicación", link: "/es/guide/publish" },
      ],
    },
  ],
  "/es/api/": [
    {
      text: "Primeros pasos",
      items: [{ text: "Resumen de la API", link: "/es/api/" }],
    },
    {
      text: "Referencia de endpoints",
      items: [
        { text: "Sistema y vista previa", link: "/es/api/system" },
        { text: "Artículos", link: "/es/api/posts" },
        { text: "Momentos", link: "/es/api/moments" },
        { text: "Subida de medios", link: "/es/api/media" },
        { text: "Ajustes del sitio", link: "/es/api/settings" },
        { text: "Datos estructurados", link: "/es/api/data" },
        { text: "Publicación y validación", link: "/es/api/publish" },
        { text: "Servicios de IA", link: "/es/api/ai" },
        { text: "Importación de Jianshu", link: "/es/api/import" },
      ],
    },
  ],
  "/zh-hant/guide/": [
    {
      text: "開始",
      items: [
        { text: "指南", link: "/zh-hant/guide/" },
        { text: "快速上手", link: "/zh-hant/guide/quick-start" },
        { text: "三倉工作區", link: "/zh-hant/guide/workspace" },
      ],
    },
    {
      text: "內容創作",
      items: [
        { text: "儀表板與預覽", link: "/zh-hant/guide/dashboard" },
        { text: "文章管理", link: "/zh-hant/guide/posts" },
        { text: "文章編輯", link: "/zh-hant/guide/post-editor" },
        { text: "說說動態", link: "/zh-hant/guide/moments" },
      ],
    },
    {
      text: "站點客製",
      items: [
        { text: "站點設定", link: "/zh-hant/guide/settings" },
        { text: "結構化資料", link: "/zh-hant/guide/data" },
      ],
    },
    {
      text: "進階",
      items: [
        { text: "平台匯入", link: "/zh-hant/guide/import" },
        { text: "AI 助手", link: "/zh-hant/guide/ai" },
        { text: "提交和發布", link: "/zh-hant/guide/publish" },
      ],
    },
  ],
  "/zh-hant/api/": [
    {
      text: "開始",
      items: [{ text: "API 總覽", link: "/zh-hant/api/" }],
    },
    {
      text: "端點參考",
      items: [
        { text: "系統與預覽", link: "/zh-hant/api/system" },
        { text: "文章", link: "/zh-hant/api/posts" },
        { text: "說說", link: "/zh-hant/api/moments" },
        { text: "媒體上傳", link: "/zh-hant/api/media" },
        { text: "站點設定", link: "/zh-hant/api/settings" },
        { text: "結構化資料", link: "/zh-hant/api/data" },
        { text: "發布與驗證", link: "/zh-hant/api/publish" },
        { text: "AI 服務", link: "/zh-hant/api/ai" },
        { text: "簡書匯入", link: "/zh-hant/api/import" },
      ],
    },
  ],
  "/de/guide/": [
    {
      text: "Erste Schritte",
      items: [
        { text: "Anleitung", link: "/de/guide/" },
        { text: "Schnellstart", link: "/de/guide/quick-start" },
        { text: "Drei-Repository-Arbeitsbereich", link: "/de/guide/workspace" },
      ],
    },
    {
      text: "Inhalte erstellen",
      items: [
        { text: "Dashboard und Vorschau", link: "/de/guide/dashboard" },
        { text: "Artikelverwaltung", link: "/de/guide/posts" },
        { text: "Artikel bearbeiten", link: "/de/guide/post-editor" },
        { text: "Momente", link: "/de/guide/moments" },
      ],
    },
    {
      text: "Website-Anpassung",
      items: [
        { text: "Website-Einstellungen", link: "/de/guide/settings" },
        { text: "Strukturierte Daten", link: "/de/guide/data" },
      ],
    },
    {
      text: "Fortgeschrittenes",
      items: [
        { text: "Plattform-Import", link: "/de/guide/import" },
        { text: "KI-Assistent", link: "/de/guide/ai" },
        { text: "Committen und veröffentlichen", link: "/de/guide/publish" },
      ],
    },
  ],
  "/de/api/": [
    {
      text: "Erste Schritte",
      items: [{ text: "API-Überblick", link: "/de/api/" }],
    },
    {
      text: "Endpunkt-Referenz",
      items: [
        { text: "System und Vorschau", link: "/de/api/system" },
        { text: "Artikel", link: "/de/api/posts" },
        { text: "Momente", link: "/de/api/moments" },
        { text: "Medien-Uploads", link: "/de/api/media" },
        { text: "Website-Einstellungen", link: "/de/api/settings" },
        { text: "Strukturierte Daten", link: "/de/api/data" },
        { text: "Veröffentlichen und Validieren", link: "/de/api/publish" },
        { text: "KI-Dienste", link: "/de/api/ai" },
        { text: "Jianshu-Import", link: "/de/api/import" },
      ],
    },
  ],
  "/ko/guide/": [
    {
      text: "시작하기",
      items: [
        { text: "가이드", link: "/ko/guide/" },
        { text: "빠른 시작", link: "/ko/guide/quick-start" },
        { text: "3저장소 작업 공간", link: "/ko/guide/workspace" },
      ],
    },
    {
      text: "콘텐츠 작성",
      items: [
        { text: "대시보드와 미리보기", link: "/ko/guide/dashboard" },
        { text: "글 관리", link: "/ko/guide/posts" },
        { text: "글 편집", link: "/ko/guide/post-editor" },
        { text: "모먼트", link: "/ko/guide/moments" },
      ],
    },
    {
      text: "사이트 커스터마이징",
      items: [
        { text: "사이트 설정", link: "/ko/guide/settings" },
        { text: "구조화 데이터", link: "/ko/guide/data" },
      ],
    },
    {
      text: "더 알아보기",
      items: [
        { text: "콘텐츠 가져오기", link: "/ko/guide/import" },
        { text: "AI 어시스턴트", link: "/ko/guide/ai" },
        { text: "커밋과 게시", link: "/ko/guide/publish" },
      ],
    },
  ],
  "/ko/api/": [
    {
      text: "시작하기",
      items: [{ text: "API 개요", link: "/ko/api/" }],
    },
    {
      text: "엔드포인트 참조",
      items: [
        { text: "시스템과 미리보기", link: "/ko/api/system" },
        { text: "글", link: "/ko/api/posts" },
        { text: "모먼트", link: "/ko/api/moments" },
        { text: "미디어 업로드", link: "/ko/api/media" },
        { text: "사이트 설정", link: "/ko/api/settings" },
        { text: "구조화 데이터", link: "/ko/api/data" },
        { text: "게시와 검증", link: "/ko/api/publish" },
        { text: "AI 서비스", link: "/ko/api/ai" },
        { text: "젠수(简书) 가져오기", link: "/ko/api/import" },
      ],
    },
  ],
};

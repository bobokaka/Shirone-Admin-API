// 多语言文档校验：结构对齐、相对链接/锚点有效性、残留 /zh/ 链接、frontmatter 完整性
// slug 算法与 VitePress 内置 slugify 完全一致（node_modules/vitepress dist 实测）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(root, "docs");
const langs = ["zh", "en", "zh-hant", "ja", "ko", "fr", "de", "es", "ru"];
const sections = ["guide", "api"];

const rControl = new RegExp(
  "[" + String.fromCharCode(0) + "-" + String.fromCharCode(31) + "]",
  "g",
);
const rSpecial = /[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g;
const rCombining = new RegExp(
  "[" + String.fromCharCode(0x0300) + "-" + String.fromCharCode(0x036f) + "]",
  "g",
);
const slug = (h) =>
  h
    .normalize("NFKD")
    .replace(rCombining, "")
    .replace(rControl, "")
    .replace(rSpecial, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/^(\d)/, "_$1")
    .toLowerCase();

const zhFiles = new Set();
for (const sec of sections) {
  const dir = path.join(docsDir, "zh", sec);
  if (fs.existsSync(dir)) {
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".md")) zhFiles.add(`${sec}/${f}`);
    }
  }
}

function extractHeadings(text) {
  const heads = [];
  let inFence = false;
  for (const line of text.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const m = /^(#{1,6})\s+(.*)$/.exec(line);
    if (m) {
      let title = m[2];
      let explicit = null;
      const em = /\s*\{#([^}]+)\}\s*$/.exec(title);
      if (em) {
        explicit = em[1];
        title = title.slice(0, em.index);
      }
      title = title
        .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
        .replace(/[*_~]/g, "");
      heads.push(explicit ?? slug(title));
    }
  }
  return heads;
}

function extractLinks(text) {
  const out = [];
  const re = /(?<!\!)\[[^\]]*\]\(([^)]+)\)/g;
  let m;
  while ((m = re.exec(text))) {
    const url = m[1].trim();
    if (/^(https?:|mailto:)/i.test(url)) continue;
    const hash = url.indexOf("#");
    let target = hash >= 0 ? url.slice(0, hash) : url;
    const anchor = hash >= 0 ? url.slice(hash + 1) : null;
    out.push({ raw: url, target, anchor });
  }
  return out;
}

const problems = [];

// 1. 文件集合对齐
for (const lang of langs) {
  if (lang === "zh") continue;
  const actual = new Set();
  for (const sec of sections) {
    const dir = path.join(docsDir, lang, sec);
    if (fs.existsSync(dir)) {
      for (const f of fs.readdirSync(dir)) {
        if (f.endsWith(".md")) actual.add(`${sec}/${f}`);
      }
    }
  }
  for (const f of zhFiles) {
    if (!actual.has(f)) problems.push(`[${lang}] 缺少 ${f}`);
  }
  for (const f of actual) {
    if (!zhFiles.has(f)) problems.push(`[${lang}] 多出 ${f}`);
  }
  if (!fs.existsSync(path.join(docsDir, lang, "index.md")))
    problems.push(`[${lang}] 缺少 index.md`);
}

// 2. 逐文件检查
for (const lang of langs) {
  const files = ["index.md", ...[...zhFiles].map((f) => f)];
  for (const rel of files) {
    const full = path.join(docsDir, lang, rel);
    if (!fs.existsSync(full)) continue;
    const text = fs.readFileSync(full, "utf8");

    // frontmatter（语言根 index.md 为 home 布局，无 title/description 属正常）
    if (rel !== "index.md") {
      const fm = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
      if (!fm) problems.push(`[${lang}] ${rel}: 缺 frontmatter`);
      else {
        if (!/^title:/m.test(fm[1])) problems.push(`[${lang}] ${rel}: frontmatter 缺 title`);
        if (!/^description:/m.test(fm[1]))
          problems.push(`[${lang}] ${rel}: frontmatter 缺 description`);
      }
    }

    // 残留 zh 前缀链接（zh 自身除外）
    if (lang !== "zh") {
      for (const m of text.matchAll(/\]\((\/zh\/[^)#?]*)/g)) {
        problems.push(`[${lang}] ${rel}: 残留 ${m[1]} 链接`);
      }
    }

    // 代码块数量与 zh 对齐（粗结构校验）
    if (lang !== "zh") {
      const zhPath = path.join(docsDir, "zh", rel);
      if (fs.existsSync(zhPath)) {
        const countF = (t) => (t.match(/^\s*```/gm) || []).length;
        if (countF(text) !== countF(fs.readFileSync(zhPath, "utf8")))
          problems.push(`[${lang}] ${rel}: 代码块数量与 zh 不一致`);
      }
    }

    // 链接有效性
    for (const link of extractLinks(text)) {
      const { target, anchor } = link;
      if (target.startsWith("/")) {
        if (target.startsWith("/assets/")) {
          if (!fs.existsSync(path.join(docsDir, target.replace(/^\//, ""))))
            problems.push(`[${lang}] ${rel}: 资源不存在 ${target}`);
          continue;
        }
        const mm = /^\/(zh|en|zh-hant|ja|ko|fr|de|es|ru)\/(.*)$/.exec(target);
        if (!mm) {
          problems.push(`[${lang}] ${rel}: 非法站内链接 ${target}`);
          continue;
        }
        if (mm[1] !== lang) problems.push(`[${lang}] ${rel}: 跨语言链接 ${target}`);
        const dest = path.join(docsDir, mm[1], mm[2]);
        if (!fs.existsSync(dest) && !fs.existsSync(dest.replace(/\/$/, "/index.md")))
          problems.push(`[${lang}] ${rel}: 目标不存在 ${target}`);
        continue;
      }
      if (target.startsWith("./") || target.startsWith("../")) {
        const dest = path.resolve(path.dirname(full), target);
        if (!fs.existsSync(dest)) {
          problems.push(`[${lang}] ${rel}: 相对链接目标不存在 ${target}`);
          continue;
        }
        if (anchor) {
          const heads = extractHeadings(fs.readFileSync(dest, "utf8"));
          const a = decodeURIComponent(anchor);
          if (!heads.includes(a) && !heads.includes(slug(a)))
            problems.push(`[${lang}] ${rel}: 锚点 #${anchor} 在 ${target} 中无对应标题`);
        }
      } else if (!target && anchor) {
        const heads = extractHeadings(text);
        const a = decodeURIComponent(anchor);
        if (!heads.includes(a) && !heads.includes(slug(a)))
          problems.push(`[${lang}] ${rel}: 页内锚点 #${anchor} 无对应标题`);
      }
    }
  }
}

if (problems.length) {
  console.log(`发现 ${problems.length} 个问题：\n`);
  for (const p of problems) console.log(" - " + p);
  process.exit(1);
} else {
  console.log("OK：9 种语言结构对齐，链接与锚点全部有效。");
}

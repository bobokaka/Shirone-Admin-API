// 锚点规范化修复器：把 Markdown 链接中的锚点重写为目标文件真实标题的 VitePress slug
// 匹配策略：精确 → slug 等价 → 骨架等价（忽略所有分隔符与非字母数字字符）
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const docsDir = path.join(root, "docs");
const langs = ["zh", "en", "zh-hant", "ja", "ko", "fr", "de", "es", "ru"];

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
const skeleton = (s) => s.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase();

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

let fixed = 0;
let unmatched = 0;

for (const lang of langs) {
  const langDir = path.join(docsDir, lang);
  if (!fs.existsSync(langDir)) continue;
  const walk = (dir) => {
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
        continue;
      }
      if (!f.endsWith(".md")) continue;
      const text = fs.readFileSync(full, "utf8");
      let changed = false;
      const newText = text.replace(
        /(?<!\!)(\[[^\]]*\]\()([^)]+)(\))/g,
        (whole, pre, url, post) => {
          if (/^(https?:|mailto:)/i.test(url)) return whole;
          const hash = url.indexOf("#");
          if (hash < 0) return whole;
          const target = url.slice(0, hash);
          const anchor = url.slice(hash + 1);
          if (!target.startsWith("./") && !target.startsWith("../") && target !== "")
            return whole;
          const dest = target
            ? path.resolve(path.dirname(full), target)
            : full;
          if (!fs.existsSync(dest)) return whole;
          const heads = extractHeadings(fs.readFileSync(dest, "utf8"));
          const a = decodeURIComponent(anchor);
          if (heads.includes(a)) return whole;
          let hit = heads.find((h) => h === slug(a));
          if (!hit) {
            const sk = skeleton(a);
            const cands = heads.filter((h) => skeleton(h) === sk);
            if (cands.length === 1) hit = cands[0];
          }
          if (!hit) {
            unmatched++;
            console.log(`  未匹配: [${lang}] ${path.relative(docsDir, full)} -> ${url}`);
            return whole;
          }
          fixed++;
          changed = true;
          return `${pre}${target}#${hit}${post}`;
        },
      );
      if (changed) fs.writeFileSync(full, newText, "utf8");
    }
  };
  walk(langDir);
}

console.log(`\n重写锚点 ${fixed} 处，无法匹配 ${unmatched} 处。`);
if (unmatched > 0) process.exit(1);

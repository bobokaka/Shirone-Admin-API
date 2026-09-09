# 自动化检测脚本

完整的 Skill 文档质量自动检测脚本。

## 完整脚本

```bash
#!/bin/bash
# Skill 文档质量自动检测脚本

SKILL_FILE="$1"
REPORT_FILE="${SKILL_FILE%.md}_audit_report.md"

echo "# Skill 文档审查报告" > "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "**文件:** \`$SKILL_FILE\`" >> "$REPORT_FILE"
echo "**审查时间:** $(date -Iseconds)" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# ===== 第一层: 自动化检测 =====

# 1. Front Matter 完整性检测
echo "## 第一层: 自动化检测结果" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
echo "### 📋 Front Matter 完整性" >> "$REPORT_FILE"

REQUIRED_FIELDS=("name:" "description:" "version:" "updateTime:" "tags:" "difficulty:")
FM_SCORE=0
for field in "${REQUIRED_FIELDS[@]}"; do
    if grep -q "^$field" "$SKILL_FILE"; then
        echo "- ✅ \`$field\` 存在" >> "$REPORT_FILE"
        ((FM_SCORE++))
    else
        echo "- ❌ \`$field\` **缺失**" >> "$REPORT_FILE"
    fi
done
echo "**得分:** $FM_SCORE/6" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

# 2. 文件命名规范检测
echo "### 📁 文件命名规范" >> "$REPORT_FILE"
FILENAME=$(basename "$SKILL_FILE")
if echo "$FILENAME" | grep -qE "^SKILLS_[A-Z_]+\.md$"; then
    echo "- ✅ 命名符合规范: \`$FILENAME\`" >> "$REPORT_FILE"
    NAMING_SCORE=1
else
    echo "- ❌ 命名不符合规范: \`$FILENAME\`" >> "$REPORT_FILE"
    echo "  - 期望格式: \`SKILLS_UPPER_SNAKE_CASE.md\`" >> "$REPORT_FILE"
    NAMING_SCORE=0
fi
echo "" >> "$REPORT_FILE"

# 3. 章节结构完整性检测
echo "### 📖 章节结构完整性" >> "$REPORT_FILE"
REQUIRED_SECTIONS=(
    "背景\|概述"
    "核心功能"
    "环境要求"
    "使用步骤"
    "示例\|场景"
    "规则\|最佳实践"
    "常见问题\|FAQ"
    "参考资源"
    "更新日志\|Changelog"
)
SECTION_COUNT=0
for pattern in "${REQUIRED_SECTIONS[@]}"; do
    if grep -q "^##.*$pattern" "$SKILL_FILE"; then
        ((SECTION_COUNT++))
    fi
done
echo "- 检测到 **$SECTION_COUNT/9** 个必需章节" >> "$REPORT_FILE"
if [ $SECTION_COUNT -lt 9 ]; then
    echo "- ⚠️ 缺少章节:" >> "$REPORT_FILE"
    for pattern in "${REQUIRED_SECTIONS[@]}"; do
        if ! grep -q "^##.*$pattern" "$SKILL_FILE"; then
            echo "  - 缺少匹配 \`$pattern\` 的章节" >> "$REPORT_FILE"
        fi
    done
fi
echo "" >> "$REPORT_FILE"

# 4. 代码块语言标识检测
echo "### 💻 代码块语言标识" >> "$REPORT_FILE"
NO_LANG_BLOCKS=$(grep '```$' "$SKILL_FILE" | grep -v '```[a-zA-Z]*' | wc -l)
if [ $NO_LANG_BLOCKS -eq 0 ]; then
    echo "- ✅ 所有代码块都有语言标识" >> "$REPORT_FILE"
    CODE_SCORE=1
else
    echo "- ⚠️ 发现 **$NO_LANG_BLOCKS** 个代码块缺少语言标识" >> "$REPORT_FILE"
    grep -n '```$' "$SKILL_FILE" | grep -v '```[a-zA-Z]*' | while read -r line; do
        echo "  - 第 ${line%%:*} 行" >> "$REPORT_FILE"
    done
    CODE_SCORE=0
fi
echo "" >> "$REPORT_FILE"

# 5. 示例场景数量检测
echo "### 📝 示例场景覆盖度" >> "$REPORT_FILE"
EXAMPLE_COUNT=$(grep -c "^###.*场景\|^###.*示例" "$SKILL_FILE" 2>/dev/null || echo 0)
echo "- 检测到 **$EXAMPLE_COUNT** 个示例场景" >> "$REPORT_FILE"
if [ $EXAMPLE_COUNT -lt 3 ]; then
    echo "- ⚠️ 建议至少包含 3 个示例场景 (基础/进阶/复杂)" >> "$REPORT_FILE"
    EXAMPLE_SCORE=0
else
    EXAMPLE_SCORE=1
fi
echo "" >> "$REPORT_FILE"

# 6. Token 效率检测 (基于行数估算)
echo "### 📊 Token 效率分析" >> "$REPORT_FILE"
LINE_COUNT=$(wc -l < "$SKILL_FILE")
echo "- 文档总行数: **$LINE_COUNT**" >> "$REPORT_FILE"
if [ $LINE_COUNT -gt 500 ]; then
    echo "- ⚠️ **超过推荐行数** (建议 < 500 行)" >> "$REPORT_FILE"
    echo "  - 考虑使用渐进式披露模式，将详细内容移至独立文件" >> "$REPORT_FILE"
    TOKEN_SCORE=0
else
    echo "- ✅ 行数在合理范围内" >> "$REPORT_FILE"
    TOKEN_SCORE=1
fi
echo "" >> "$REPORT_FILE"

# 7. 术语一致性检测
echo "### 🔄 术语一致性检查" >> "$REPORT_FILE"
# 检测常见的术语变体
INCONSISTENCIES=0
# 示例: 检查 "Skill" vs "skill" 的大小写一致性
SKILL_UPPER=$(grep -o "\bSkill\b" "$SKILL_FILE" | wc -l)
SKILL_LOWER=$(grep -o "\bskill\b" "$SKILL_FILE" | wc -l)
if [ $SKILL_UPPER -gt 0 ] && [ $SKILL_LOWER -gt 0 ]; then
    echo "- ⚠️ 发现大小写不一致: \`Skill\` ($SKILL_UPPER) vs \`skill\` ($SKILL_LOWER)" >> "$REPORT_FILE"
    INCONSISTENCIES=1
fi
if [ $INCONSISTENCIES -eq 0 ]; then
    echo "- ✅ 术语使用一致" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# 8. 时效性检测
echo "### 🕐 时效性检查" >> "$REPORT_FILE"
UPDATE_DATE=$(grep "^updateTime:" "$SKILL_FILE" | head -1 | cut -d':' -f2- | xargs)
if [ -n "$UPDATE_DATE" ]; then
    echo "- 📅 更新日期: \`$UPDATE_DATE\`" >> "$REPORT_FILE"
    # 计算距今天数
    UPDATE_SEC=$(date -d "$UPDATE_DATE" +%s 2>/dev/null || echo 0)
    CURRENT_SEC=$(date +%s)
    DAYS_DIFF=$(( (CURRENT_SEC - UPDATE_SEC) / 86400 ))
    if [ $DAYS_DIFF -gt 180 ]; then
        echo "- ⚠️ 文档已超过 **$DAYS_DIFF 天**未更新，建议审查内容时效性" >> "$REPORT_FILE"
    fi
else
    echo "- ❌ 未找到 \`updateTime\` 字段" >> "$REPORT_FILE"
fi
echo "" >> "$REPORT_FILE"

# ===== 综合评分 =====
echo "## 综合评分" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"
TOTAL_SCORE=$(( FM_SCORE * 5 + NAMING_SCORE * 5 + (SECTION_COUNT * 5 / 9) + CODE_SCORE * 5 + EXAMPLE_SCORE * 5 + TOKEN_SCORE * 5 ))
echo "**得分:** $TOTAL_SCORE/100" >> "$REPORT_FILE"
echo "" >> "$REPORT_FILE"

if [ $TOTAL_SCORE -ge 90 ]; then
    echo "**等级:** ✅ 优秀 (可作为模板参考)" >> "$REPORT_FILE"
elif [ $TOTAL_SCORE -ge 70 ]; then
    echo "**等级:** ✅ 合格 (可以使用)" >> "$REPORT_FILE"
else
    echo "**等级:** ❌ 不合格 (需要改进)" >> "$REPORT_FILE"
fi

echo "" >> "$REPORT_FILE"
echo "报告已生成: \`$REPORT_FILE\`"
```

## 使用方法

```bash
# 审查单个文件
bash skills/skill-optimizer/reference/audit-script.sh skills/SKILLS_XXX.md

# 批量审查
for file in skills/SKILLS_*.md; do
    bash skills/skill-optimizer/reference/audit-script.sh "$file"
done
```

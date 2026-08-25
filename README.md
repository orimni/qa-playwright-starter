# QA Playwright Starter

一个面向自动化测试入门者的完整练习项目：用 Playwright + TypeScript 测试一个本地商城的 UI 和 API，并通过 GitHub Actions 在每次提交时自动执行。

## 这个项目展示什么能力

- 能把需求拆成正向和反向测试场景
- 使用 Page Object Model（页面对象模型）组织 UI 测试
- 使用稳定的 `data-testid` 定位元素，减少脆弱的 CSS/XPath
- 用 API 测试验证状态码、响应结构和错误处理
- 自动收集失败时的截图、视频和 trace
- 用 GitHub Actions 做持续集成（CI）

## 快速开始

环境要求：Node.js 20+。

```bash
npm install
npx playwright install chromium
npm test
```

常用命令：

```bash
npm run test:ui       # 只运行 UI 测试
npm run test:api      # 只运行 API 测试
npm run test:headed   # 显示浏览器运行
npm run test:debug    # 调试模式，逐步执行
npm run typecheck     # 检查 TypeScript 类型
npm run report        # 打开 HTML 报告
```

## 项目结构

```text
demo-app/              # 本地练习商城和 API，不依赖外部网站
tests/pages/            # Page Object Model
tests/ui/               # 登录、购物、下单 UI 测试
tests/api/              # 登录和商品 API 测试
.github/workflows/      # GitHub Actions CI 配置
playwright.config.ts    # 测试运行器、浏览器、报告和本地服务配置
```

## 自动化测试流程

1. 读取需求，列出成功、失败、边界场景。
2. 准备测试数据和可控的测试环境。
3. 编写测试步骤和断言（预期结果）。
4. 本地运行，定位失败原因并修复测试或产品缺陷。
5. 在 CI 中重复执行，保留报告和失败证据。
6. 根据风险维护回归测试集。

## 入门学习路线

### 第 1 阶段：测试基础

掌握测试用例、前置条件、测试步骤、预期结果、缺陷、回归测试、冒烟测试，以及测试金字塔：单元测试最多，API/集成测试居中，UI 测试只覆盖关键用户路径。

### 第 2 阶段：Playwright 基础

练习 `page.goto`、`locator`、`getByRole`、`getByTestId`、`expect`、等待机制和 trace。重点理解：测试不是“模拟点击”，而是验证可观察的业务结果。

### 第 3 阶段：工程化

学习 Page Object Model、测试数据管理、环境变量、并行执行、失败重试、报告和 CI。本仓库已经给出了第一版工程骨架。

## 面试时可以这样介绍

> 我使用 Playwright 和 TypeScript 搭建了一个 UI + API 自动化测试项目。UI 层采用 Page Object Model，接口层验证状态码和响应契约，测试失败时自动保留截图、视频和 trace，并通过 GitHub Actions 在 push 和 pull request 时执行回归测试。

## 推送到 GitHub

在 GitHub 创建一个空仓库后，在本目录执行：

```bash
git init
git add .
git commit -m "feat: add Playwright UI and API automation starter"
git branch -M main
git remote add origin https://github.com/<你的用户名>/<仓库名>.git
git push -u origin main
```

不要把真实密码、token 或 `.env` 文件提交到仓库。本项目中的账号只是本地演示账号。

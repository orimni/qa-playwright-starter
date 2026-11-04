# 自动化测试学习交接日志

> 用途：交给接手的 agent 继续辅导用户。请以“引导用户思考和动手”为主，不要一次贴出完整答案。

## 用户目标与学习偏好

- 用户正在补足自动化测试实战能力，想把项目作为 GitHub 上的第一个作品。
- 用户此前学习过测试课程，成绩不错，但自述已经忘了自动化测试流程。
- 简历方向是游戏测试开发 / SDET；提及 Java、Spring Boot、MyBatis、MySQL、Python、Requests、Pytest、Postman、JMeter、Charles/Fiddler、ADB，以及电商、订单和游戏活动/奖励结算等业务。
- 用户希望像上课一样循序渐进地学习，会称呼辅导者“老师”。
- 用户明确反馈过“跑通了但感觉没学到什么”。之后应避免只让用户复制代码；先让用户描述测试思路、预测结果、自己编写小改动，再给分级提示和解释。
- 用户主动提出需求信息不足时会指出来。尊重这种质疑；测试预期必须来自已说明的业务规则，不要擅自假定。

## 项目与仓库当前状态（交接时已核对）

- 本地路径：`D:\testing\qa-playwright-starter`
- GitHub 仓库：`https://github.com/orimni/qa-playwright-starter`
- 分支：`main`
- 远程：`origin` 指向上述 GitHub 仓库；交接核对时 `main...origin/main`，工作区干净。
- 最近提交：
  - `cd9b4e4 test: add data-driven order validation cases`
  - `4f9d77e fix: reject orders with unknown product IDs`
  - `5e12424 test: add cart and checkout UI coverage`
  - `9876abe feat: add Playwright UI and API automation starter`
- 用户已成功 push，GitHub Actions 的 `Playwright tests` 工作流至少成功运行过一次，绿色通过并上传 `playwright-report` artifact。截图显示有 Node.js 20 deprecated 的黄色 warning，不影响本次成功结果。
- 首轮本地测试曾因 Chromium headless-shell 缺失而无法启动 UI 测试；在 `playwright.config.ts` 指定 `channel: 'chromium'` 后，测试能在用户 Windows 环境运行。不要无故移除此配置。
- 常用命令：
  - `npm run test:api`
  - `npm run test:ui`
  - `npm test`
  - `npm run typecheck`

## 当前项目是什么（重要边界）

这是一个本地、教学用模拟商城，不是接入真实电商服务：

- `demo-app/server.js` 用 Node 内置 HTTP 服务提供页面静态文件和 API。
- 商品写死在 `products` 数组中：ID `1` Wireless Mouse，ID `2` Mechanical Keyboard，ID `3` USB-C Hub。
- 演示登录账号：`qa.user` / `P@ssw0rd`；登录成功返回演示 token `demo-token`。
- UI 在 `demo-app/public/`；API 包括 `/api/health`、`/api/products`、`/api/login`、`/api/orders`。
- Playwright 的 `webServer` 会在测试时自动启动本地服务。
- API 测试通过 Playwright `request` fixture 对本地 HTTP 服务发真实请求；响应不是 mock，但业务数据和服务都只是演示实现。
- 当前订单实现校验收货人、地址、items 是非空数组、商品 ID 存在；**并没有校验 Authorization token、库存、数量、价格、幂等性或数据库持久化**。这些不能描述成现有能力。

## 用户已经亲手练习并表达出来的知识

1. UI 测试从用户可见操作和结果验证关键体验；API 测试直接请求后端，验证接口规则与响应。
2. 针对“用户点击登录后显示错误提示”最终应优先做 UI 测试，因为目标是可见提示；API 可单独验证错误凭据返回 401。
3. 对“Token 过期后创建订单返回 401”应优先做 API 测试，因为需求是接口状态码/鉴权契约。当前项目尚未实现该规则，适合作为下一轮 TDD 练习，但先确认需求与用例，再让用户动手。
4. 写“空购物车不能提交”用例时，应填写合法收货人和地址，控制其他变量，避免浏览器 HTML required 校验导致测错原因。
5. 初始订单接口只检查 `items` 为非空数组；用户推断 `[999]` 会成功是基于当时已知规则，用户指出未提供商品列表时不能默认 ID 无效。随后明确了商品 ID 必须存在的业务规则，并检查了本地商品 ID。
6. 用户写了非法商品 ID API 测试，观察到预期 400、实际 201；随后自己改后端加入 ID 检查并通过测试。这是用户真正完成的 TDD/缺陷修复闭环。
7. 用户辨认了数据驱动测试中重复的请求地址、客户名、地址、状态码，与变化的 items 和错误信息，并使用循环生成多条测试。
8. 用户尝试加入 `items: '1'` 案例后直接运行 API 测试成功。先前辅导者对 TypeScript 推断会不会报错的预期不准确；随后加入显式 `InvalidOrderCase` 类型 `items: number[] | string`，用户执行了 typecheck 和 API tests。
9. 数据驱动边界案例现包括空数组、未知 ID、字符串、合法和非法 ID 混合 `[1,999]`，预期分别基于当前已说明规则。
10. 用户做过 UI 加购物车数量测试、空购物车反向测试，并将 `orderError` 定位封装到 `CheckoutPage`。
11. 用户完成过 Git 首次提交、安装 Windows Git、设置 GitHub noreply 邮箱、push 到远程，并观察 GitHub Actions 成功。

## 当前关键代码范围

- `tests/api/orders.spec.ts`：当前数据驱动订单反向测试和成功创建订单测试。
- `demo-app/server.js`：本地服务、商品数组和订单验证规则。
- `tests/ui/login.spec.ts`：登录正反向 UI 测试（用户练习期间增加了商品数量断言；交接时文件需以当前 checkout 为准）。
- `tests/ui/cart.spec.ts`：添加两个商品后购物车计数为 2。
- `tests/ui/checkout.spec.ts`：成功下单以及空购物车下单反向 UI 测试（交接核对发现第二个 `test` 目前在文件顶层，功能可运行但可引导用户整理成清晰的 `describe` 分组，非紧急）。
- `tests/pages/CheckoutPage.ts`：含 `orderError` locator、订单商品检查和下单动作。
- `playwright.config.ts`：Chromium、HTML/list reporter、失败 trace/screenshot/video、本地 webServer。
- `.github/workflows/playwright.yml`：push/PR 到 main 时 npm ci、安装 Chromium、运行测试、上传报告。
- `docs/learning-notes.md`、`docs/resume-alignment.md`：原有学习资料。

## 适合继续学习的路线

建议每次聚焦一个概念，并让用户先回答，不要一次给完整代码：

1. **测试设计再巩固**：让用户从清晰需求中自行列前置条件、操作、预期结果；用等价类、边界值、控制变量检查测试是否验证目标。
2. **鉴权与状态码**：从需求澄清开始，讨论 401 与 403 的适用场景。注意先说明当前 demo 只是演示实现，决定 token 失效需求后再写测试；遵循红-绿-重构，让用户先写测试。
3. **失败诊断**：让用户判断失败来自断言、应用逻辑、测试数据或环境，尝试查看 HTML report/trace，而不是只看绿色/红色。
4. **API 边界与契约**：参数缺失、类型、未知字段、错误响应结构；每个期望都先确认需求，不凭空添加规则。
5. **可维护性**：测试分组、辅助函数/fixtures、数据驱动、命名、避免重复；用户自己重构并解释取舍。
6. **Python + Requests + Pytest**：等用户能独立解释当前 TS/Playwright 测试后，将一两条 API 测试重写为简洁 pytest 版本，帮助映射简历技术栈。
7. **游戏业务测试**：再把活动、背包道具发放、奖励结算、限购等业务变成本地模拟接口练习；明确这是练习项目，不夸大成真实线上经验。

## 教学方式约定

- 一次只给一个任务；先让用户预测结果或写测试用例，再给小提示，最后才展示参考实现。
- 用户说不懂时，分解解释流程、输入、状态、响应和断言；不要只重复整份代码。
- 用户明确质疑前提时，先承认并核对规则；不得把未定义行为说成测试人员应默认知道。
- 每次练习后要求用户用自己的话说明：测试验证什么、预期为何如此、失败意味着什么。
- 不要在没有检查当前文件的情况下声称用户改动已提交、已推送或测试通过。用户自行操作时，可让其提供结果；本地核验须真实执行。
- 简历建议只写用户确实理解、亲手做过并能解释的能力；避免把模拟服务说成生产系统经验。

## 最近对话的停留点

用户刚完成 `items` 的数据驱动 API 测试和 push，并问“今天还要继续学吗”。当时建议今天收尾，复述三点：为什么空购物车用例要填写其他字段、为什么 `[1,999]` 拒绝、为什么 UI 提示需求要用 UI 验证。下次建议从 Token 过期返回 401 的需求开始，但要按上述教学方式让用户先分析，而不是直接贴答案。

## 接手 agent 的第一步

先简短确认这份日志已说明学习进度，并从一个小问题继续，例如让用户用自己的话讲清楚“Token 过期请求下单，接口层要观察哪些内容”；依据回答再决定要补充什么。不要重做项目搭建或重复基础登录/购物车练习。

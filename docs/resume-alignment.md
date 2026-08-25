# 简历能力与项目对应关系

这份项目用于把简历上的“会使用”变成可以运行、可以解释、可以展示的证据。没有真正练习过的内容，不应该直接写成“熟练掌握”。

| 简历方向 | 本项目中的证据 | 下一步补强 |
| --- | --- | --- |
| 测试用例设计 | 登录正反例、购物下单主链路、接口错误码和契约断言 | 增加边界值、状态迁移、数据驱动用例 |
| 接口测试 | `tests/api/products.spec.ts` 验证状态码、字段类型和错误响应 | 补充鉴权、幂等性、参数缺失、并发接口测试 |
| UI 自动化 | `tests/ui/` 覆盖登录、加购、下单 | 补充等待策略、弹窗、表格、文件上传等常见场景 |
| Page Object Model | `tests/pages/` 把页面操作与测试意图分离 | 学习 fixture、测试数据工厂和多环境配置 |
| CI/CD | `.github/workflows/playwright.yml` 每次 push/PR 自动运行 | 上传报告、分支保护、失败重试和定时回归 |
| 电商/游戏业务 | 购物车、库存和订单链路与原简历项目相近 | 将产品模型扩展为活动、背包、奖励结算和限购 |
| Python / Pytest | 本项目先用 TypeScript/Playwright 建立自动化闭环 | 第二阶段用 Python + Requests + Pytest 重写 API 测试 |

## 真实面试表达

完成并理解本项目后，可以说：

> 我从测试场景拆分开始，使用 Playwright + TypeScript 编写了 UI 和 API 自动化测试。UI 测试采用 Page Object Model，API 测试验证状态码和响应契约，失败时保留截图、视频和 trace，并通过 GitHub Actions 在 push 和 pull request 时执行。

不要把尚未练习过的 Python/Pytest、JMeter 或移动端性能专项描述成已经独立落地；后续每完成一个里程碑，再把对应内容补进简历。

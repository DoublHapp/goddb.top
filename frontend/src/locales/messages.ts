export const messages = {
  'zh-CN': {
    nav: { home: '首页', about: '关于', projects: '项目', blog: '日志' },
    common: { viewAll: '查看全部', open: '打开记录', back: '返回', repo: '源代码', demo: '在线访问', read: '继续阅读', min: '分钟阅读', menu: '菜单' },
    home: { eyebrow: 'SESSION / 公开终端', titleA: '构建清晰的', titleB: '数字系统。', intro: '当前信号', projects: '精选项目', posts: '最新日志' },
    about: { eyebrow: 'PROFILE / 操作者档案', title: '在复杂性中寻找结构。', bio: '我喜欢把模糊需求拆解为可验证的系统：先理解问题，再设计边界，最后用代码交付清晰、可靠且可持续演进的产品。', capabilities: '能力矩阵', principles: '工作原则', facts: ['以测试固定关键行为', '让类型承载系统约束', '优先清晰，再追求聪明', '持续缩短反馈回路'] },
    projects: { eyebrow: 'INDEX / 项目档案', title: '构建记录', subtitle: '实验、产品与工程系统的持续索引。', empty: '未找到项目', overview: '项目概览', stack: '技术协议' },
    blog: { eyebrow: 'LOG / 技术日志', title: '思考与实践', subtitle: '关于前端架构、框架内部机制与系统设计的工作笔记。', all: '全部记录' },
    notFound: { code: 'ERR_ROUTE_NOT_FOUND', title: '这个地址没有任何信号。', action: '返回控制台' },
    footer: '以好奇心构建，以证据验证。', status: '系统正常', language: 'EN',
  },
  en: {
    nav: { home: 'Home', about: 'About', projects: 'Projects', blog: 'Log' },
    common: { viewAll: 'View all', open: 'Open record', back: 'Go back', repo: 'Source', demo: 'Live site', read: 'Continue reading', min: 'min read', menu: 'Menu' },
    home: { eyebrow: 'SESSION / PUBLIC TERMINAL', titleA: 'Building clear', titleB: 'digital systems.', intro: 'Current signal', projects: 'Selected projects', posts: 'Latest logs' },
    about: { eyebrow: 'PROFILE / OPERATOR FILE', title: 'Finding structure in complexity.', bio: 'I turn ambiguous requirements into systems that can be verified: understand the problem, design the boundaries, then deliver clear, reliable products that continue to evolve.', capabilities: 'Capability matrix', principles: 'Working principles', facts: ['Pin critical behavior with tests', 'Let types carry constraints', 'Choose clarity before cleverness', 'Continuously shorten feedback loops'] },
    projects: { eyebrow: 'INDEX / PROJECT ARCHIVE', title: 'Build records', subtitle: 'An evolving index of experiments, products, and engineering systems.', empty: 'No projects found', overview: 'Project overview', stack: 'Technical protocol' },
    blog: { eyebrow: 'LOG / TECHNICAL NOTES', title: 'Thinking in public', subtitle: 'Working notes on frontend architecture, framework internals, and system design.', all: 'All entries' },
    notFound: { code: 'ERR_ROUTE_NOT_FOUND', title: 'There is no signal at this address.', action: 'Return to console' },
    footer: 'Built with curiosity. Verified with evidence.', status: 'System nominal', language: '中',
  },
} as const

export type MaterialType =
  | "vertical_poster"
  | "wechat_moment"
  | "xiaohongshu_cover"
  | "wechat_article_cover"
  | "rollup_banner"
  | "flyer"
  | "course_schedule"
  | "price_sheet"
  | "process_map";

export type MaterialDefinition = {
  type: MaterialType;
  name: string;
  size: string;
  scenario: string;
  layout: string;
};

export const MATERIALS: MaterialDefinition[] = [
  {
    type: "vertical_poster",
    name: "竖版海报",
    size: "1080x1920",
    scenario: "适合微信群、朋友圈单图传播",
    layout: "竖向结构，顶部品牌和主标题，中部 3-5 个卖点卡片，下部价格和时间，右下角预留二维码。",
  },
  {
    type: "wechat_moment",
    name: "朋友圈宣传图",
    size: "1080x1440",
    scenario: "适合朋友圈快速传播，信息少，标题强",
    layout: "突出主标题和一句副标题，保留 3 个以内核心卖点，CTA 简洁醒目。",
  },
  {
    type: "xiaohongshu_cover",
    name: "小红书封面",
    size: "1242x1660",
    scenario: "适合小红书首图，强调可读标题和收藏价值",
    layout: "上方强标题，中部知识感视觉元素，下方短 CTA，避免堆砌细节。",
  },
  {
    type: "wechat_article_cover",
    name: "公众号头图",
    size: "900x383",
    scenario: "适合公众号文章封面，横向标题视觉",
    layout: "横版结构，左侧标题文案，右侧抽象教育视觉或品牌符号，信息高度克制。",
  },
  {
    type: "rollup_banner",
    name: "易拉宝",
    size: "800x2000",
    scenario: "适合线下咨询场景，信息更完整",
    layout: "从上到下包含品牌、产品、优势、流程、价格提示和二维码位，使用分区排版。",
  },
  {
    type: "flyer",
    name: "A4 传单",
    size: "1240x1754",
    scenario: "适合线下派发和咨询介绍",
    layout: "A4 信息页，标题、卖点、课程安排、价格、报名方式分块展示。",
  },
  {
    type: "course_schedule",
    name: "课程安排图",
    size: "1080x1440",
    scenario: "适合解释阶段、时间轴和课时安排",
    layout: "使用清晰时间轴或表格呈现阶段、时间和内容，不使用复杂背景。",
  },
  {
    type: "price_sheet",
    name: "价格说明图",
    size: "1080x1440",
    scenario: "适合突出价格、优惠、套餐和报名规则",
    layout: "价格卡片为核心，展示原价、优惠价、报名规则和提醒，避免促销低质感。",
  },
  {
    type: "process_map",
    name: "活动流程图",
    size: "1080x1440",
    scenario: "适合说明咨询、诊断、规划、学习、复盘流程",
    layout: "使用步骤卡片或流程线，突出每一步动作和转化路径。",
  },
];

export function getMaterial(type: string) {
  return MATERIALS.find((item) => item.type === type);
}

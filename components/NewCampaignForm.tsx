"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MATERIALS } from "@/lib/materials";

const initial = {
  productName: "强基全年班",
  productType: "教育课程",
  targetAudience: "目标清北、华五及顶尖985强基计划的高中学生和家长",
  painPoints: "不了解强基计划政策和校测节奏；高一高二缺少系统准备；只重视高考分数，忽视强基笔试和面试能力；家长不知道如何规划长期备考路径",
  sellingPoints: "覆盖暑期、秋季、寒假三阶段；共100课时系统学习；聚焦数学、物理、化学等强基核心能力；配套规划老师进行阶段性学习跟进；从应试型学习逐步过渡到研究型学习",
  priceInfo: "原价44800元，优惠后34800元",
  scheduleInfo: "2026年暑期正式开课，贯穿高一暑期、高二秋季、高二寒假三个阶段",
  processInfo: "产品咨询 → 学情诊断 → 阶段规划 → 课程学习 → 阶段复盘 → 后续强基一对一衔接",
  cta: "扫码咨询课程详情",
  notes: "名额有限，适合有强基计划和985高校升学目标的学生。避免使用保过、必上岸等绝对化表述。",
  stylePreference: "高端、简洁、教育咨询、清北紫、专业可信",
};

export function NewCampaignForm() {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [materials, setMaterials] = useState<string[]>([
    "vertical_poster",
    "wechat_moment",
    "course_schedule",
    "price_sheet",
    "rollup_banner",
  ]);
  const [error, setError] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);

  function update(name: string, value: string) {
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/campaigns", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, materials }),
    });
    if (!response.ok) {
      setError("创建 Campaign 失败，请检查必填字段。");
      return;
    }
    const campaign = await response.json();
    await fetch(`/api/campaigns/${campaign.id}/brief`, { method: "POST" });
    router.push(`/campaigns/${campaign.id}/brief`);
  }

  return (
    <form className="grid" onSubmit={submit}>
      {error && <div className="error">{error}</div>}
      <div className="grid grid-2">
        <label>
          产品名称
          <input required value={form.productName} onChange={(event) => update("productName", event.target.value)} />
        </label>
        <label>
          产品类型
          <input value={form.productType} onChange={(event) => update("productType", event.target.value)} />
        </label>
      </div>
      <label>
        目标用户
        <textarea value={form.targetAudience} onChange={(event) => update("targetAudience", event.target.value)} />
      </label>
      <label>
        用户痛点
        <textarea value={form.painPoints} onChange={(event) => update("painPoints", event.target.value)} />
      </label>
      <label>
        核心卖点
        <textarea value={form.sellingPoints} onChange={(event) => update("sellingPoints", event.target.value)} />
      </label>
      <div className="grid grid-2">
        <label>
          价格信息
          <textarea value={form.priceInfo} onChange={(event) => update("priceInfo", event.target.value)} />
        </label>
        <label>
          时间安排
          <textarea value={form.scheduleInfo} onChange={(event) => update("scheduleInfo", event.target.value)} />
        </label>
      </div>
      <label>
        课程/活动流程
        <textarea value={form.processInfo} onChange={(event) => update("processInfo", event.target.value)} />
      </label>
      <div className="grid grid-2">
        <label>
          报名方式 / CTA
          <input value={form.cta} onChange={(event) => update("cta", event.target.value)} />
        </label>
        <label>
          视觉风格偏好
          <input value={form.stylePreference} onChange={(event) => update("stylePreference", event.target.value)} />
        </label>
      </div>
      <label>
        注意事项
        <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>

      <div>
        <h3>希望生成的物料类型</h3>
        <div className="checkbox-grid">
          {MATERIALS.map((item) => (
            <label className="check" key={item.type}>
              <input
                checked={materials.includes(item.type)}
                type="checkbox"
                onChange={(event) => {
                  setMaterials((current) =>
                    event.target.checked ? [...current, item.type] : current.filter((value) => value !== item.type),
                  );
                }}
              />
              {item.name} {item.size}
            </label>
          ))}
        </div>
      </div>

      <label>
        上传参考素材
        <input multiple type="file" accept="image/*" onChange={(event) => setFiles(event.target.files)} />
      </label>
      {files && <p className="muted">已选择 {files.length} 个文件，MVP 阶段仅做本地预览入口，不上传到服务器。</p>}

      <div className="btn-row">
        <button className="primary" type="submit">
          生成宣传 Brief
        </button>
      </div>
    </form>
  );
}

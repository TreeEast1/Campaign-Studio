import { NewCampaignForm } from "@/components/NewCampaignForm";

export default function NewCampaignPage() {
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">新建宣传任务</h1>
          <p className="lead">输入产品信息、价格、卖点、流程和风格偏好，先生成结构化 Brief，再拆解多物料 Prompt。</p>
        </div>
      </div>
      <div className="panel">
        <NewCampaignForm />
      </div>
    </>
  );
}

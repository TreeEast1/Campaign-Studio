import { getImageApiStatus } from "@/services/image/config";

export async function ApiStatus() {
  const status = await getImageApiStatus();
  const label = status.hasApiKey
    ? `生图 API 状态：已配置 ${status.provider}`
    : "生图 API 状态：未配置";

  return (
    <div className="status">
      <span className={`dot ${status.hasApiKey ? "ok" : ""}`} />
      <span>{label}</span>
    </div>
  );
}

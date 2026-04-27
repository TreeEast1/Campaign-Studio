import { ImageApiForm } from "@/components/ImageApiForm";
import { getImageApiStatus } from "@/services/image/config";

export default async function ImageApiSettingsPage() {
  const status = await getImageApiStatus();
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">生图 API 配置</h1>
          <p className="lead">选择 OpenAI Images API、Replicate 或自定义 HTTP API，配置后才会调用真实生图能力。</p>
        </div>
      </div>
      <div className="panel">
        <ImageApiForm initial={status} />
      </div>
    </>
  );
}

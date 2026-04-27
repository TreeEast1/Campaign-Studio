import { BrandForm } from "@/components/BrandForm";
import { getBrandProfile } from "@/lib/brand";

export default async function BrandPage() {
  const brand = await getBrandProfile();
  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">品牌配置</h1>
          <p className="lead">维护默认品牌风格，Prompt 生成时会自动注入品牌色、语气、版式习惯和禁用宣称。</p>
        </div>
      </div>
      <div className="panel">
        <BrandForm initial={brand} />
      </div>
    </>
  );
}

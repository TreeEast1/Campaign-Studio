import { notFound } from "next/navigation";
import { AssetGrid } from "@/components/AssetGrid";
import { prisma } from "@/lib/prisma";

export default async function AssetsPage({ params }: { params: { id: string } }) {
  const campaign = await prisma.campaign.findUnique({
    where: { id: params.id },
    include: {
      assets: {
        orderBy: { createdAt: "desc" },
        include: { promptPackage: true },
      },
    },
  });
  if (!campaign) notFound();

  return (
    <>
      <div className="topbar">
        <div>
          <h1 className="h1">生成结果</h1>
          <p className="lead">未生成时显示待生成占位；只有真实 API 返回成功后才显示正式图片。</p>
        </div>
      </div>
      <AssetGrid campaignId={campaign.id} assets={campaign.assets} />
    </>
  );
}

import { dashboardAccessor } from "@/utils/accessors/Dashboard";
import { IDashboardData } from "@/types";
import Layout from "@/components/dashboard/layout";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  const data: IDashboardData = await dashboardAccessor.getDashboardData(
    userId,
    30,
  );

  return <Layout data={data} />;
}

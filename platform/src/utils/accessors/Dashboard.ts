import axios from "axios";

class DashboardAccessor {
  async getDashboardData(userId: string, days = 30) {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/dashboard/${userId}`,
      {
        params: { days },
        timeout: 10000,
        headers: { "Cache-Control": "no-store" },
      },
    );

    return res.data;
  }
}

export const dashboardAccessor = new DashboardAccessor();

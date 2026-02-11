"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useParams, useRouter } from "next/navigation";
import { useDashboardStore } from "@/store/dashboard";
import { IDashboardData } from "@/types";

import Header from "../header";
import Stats from "../stats";
import Charts from "../charts";
import Table from "../table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ILayout {
  data: IDashboardData;
}

export default function Layout({ data }: ILayout) {
  const { setData } = useDashboardStore();
  const router = useRouter();

  const [userId, setUserId] = useState("");

  useEffect(() => {
    setData(data);
  }, [setData, data]);

  const handleSubmit = () => {
    const id = userId.trim();
    if (!id) return;
    router.push(`/dashboard/${id}`);
  };

  if (!data.hasData) {
    return (
      <div className="container mx-auto pt-28 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full space-y-6 text-center">
          <h2 className="text-2xl font-bold">No coding data found</h2>

          <p className="text-muted-foreground">
            Enter your userId to view your dashboard
          </p>

          <div className="flex gap-3">
            <Input
              placeholder="Enter userId"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />

            <Button onClick={handleSubmit}>Open Dashboard</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 container mx-auto py-10 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Header />
        <Stats />
        <Charts />
        <Table />
      </motion.div>
    </div>
  );
}

"use server";

import { db } from "@/lib/db";
import { Record } from "@/types/Record";
import { auth } from "@clerk/nextjs/server";

async function getUserRecord(): Promise<{
  record?: number;
  daysWithRecords?: number;
  error?: string;
}> {
  const { userId } = await auth();
  if (!userId) {
    return { error: "User not found" };
  }

  try {
    const records = await db.record.findMany({
      where: { userId },
    });
    const record = records.reduce((sum, record) => sum + record.amount, 0);

    const daysWithRecords = records.filter(
      (record) => record.amount > 0
    ).length;
    return { record, daysWithRecords };
  } catch (error) {
    console.error("Error fetching user record:", error);
    return { error: "Database error" };
  }
}

export default getUserRecord;

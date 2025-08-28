"use server";
import { db } from "@/lib/db";
import { Record } from "@/types/Record";
import { auth } from "@clerk/nextjs/server";

async function getRecords(): Promise<{
  records?: Record[];
  error?: string;
}> {
  const { userId } = await auth();

  if (!userId) {
    return { error: "User not found" };
  }
  try {
    const records = await db.record.findMany({
      where: { userId },
      orderBy: {
        date: "desc",
      },
      take: 10,
    });
    return { records };
  } catch (error) {
    console.error("Error fetching records:", error);

    return { error: "Database error" };
  }
}
export default getRecords;

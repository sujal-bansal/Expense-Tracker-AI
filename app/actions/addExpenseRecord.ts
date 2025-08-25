"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface RecordData {
  text: string;
  amount: number;
  category: string;
  date: string;
}

interface RecordResult {
  data?: RecordData;
  error?: string;
}

async function addExpenseRecord(formData: FormData): Promise<RecordResult> {
  const textValue = formData.get("text");
  const amountValue = formData.get("amount");
  const categoryValue = formData.get("category");
  const dateValue = formData.get("date");

  if (
    !textValue ||
    textValue === "" ||
    !amountValue ||
    amountValue === "" ||
    !categoryValue ||
    categoryValue === "" ||
    !dateValue ||
    dateValue === ""
  ) {
    return { error: "All fields are required" };
  }

  const text: string = textValue.toString();
  const amount: number = parseFloat(amountValue.toString());
  const category: string = categoryValue.toString();

  let date: string;
  try {
    const inputDate = dateValue.toString();
    const [year, month, day] = inputDate.split("-");
    const dateObj = new Date(
      Date.UTC(parseInt(year), parseInt(month), parseInt(day), 12, 0, 0)
    );
    date = dateObj.toISOString();
  } catch (error) {
    console.error("Invalid date format", error);
    return { error: "Invalid date format" };
  }

  const { userId } = await auth();

  if (!userId) {
    return {
      error: "User not found",
    };
  }

  try {
    const createdRecord = await db.record.create({
      data: {
        text,
        amount,
        category,
        date,
        userId,
      },
    });

    const recordData: RecordData = {
      text: createdRecord.text,
      category: createdRecord.category,
      amount: createdRecord.amount,
      date: createdRecord.date?.toISOString() || date,
    };

    revalidatePath("/");
    return { data: recordData };
  } catch (error) {
    console.error("Error adding expense record: ", error);
    return {
      error: "An unexpected error occured while adding the expense record",
    };
  }
}

export default addExpenseRecord;

import {NextResponse} from "next/server";
import {getAvailability} from "@/lib/booking";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? new Date().toISOString();
  const minutes = parseInt(searchParams.get("slot") ?? "30", 10) || 30;
  const data = await getAvailability(date, minutes);
  return NextResponse.json(data, { headers: { "Cache-Control": "no-store" } });
}



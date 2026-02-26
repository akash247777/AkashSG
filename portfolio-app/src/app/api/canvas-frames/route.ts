import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-static";

export async function GET() {
  try {
    const canvasDir = path.join(process.cwd(), "public", "canvas");
    const files = fs
      .readdirSync(canvasDir)
      .filter((f) => f.endsWith(".png"))
      .sort();
    return NextResponse.json({ files, count: files.length });
  } catch {
    return NextResponse.json({ files: [], count: 0 });
  }
}

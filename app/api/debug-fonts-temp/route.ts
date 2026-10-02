import { NextResponse } from "next/server";
import { existsSync } from "fs";
import path from "path";

export const runtime = "nodejs";

export async function GET() {
  const dir = path.join(process.cwd(), "lib/pdf/fonts");
  const files = [
    "DMSerifDisplay-Regular.ttf",
    "DMSerifDisplay-Italic.ttf",
    "CormorantGaramond-Italic.ttf",
    "Montserrat-Regular.ttf",
    "Montserrat-Medium.ttf",
    "Montserrat-SemiBold.ttf",
    "Montserrat-Bold.ttf",
  ];
  const status = Object.fromEntries(files.map((f) => [f, existsSync(path.join(dir, f))]));
  return NextResponse.json({ cwd: process.cwd(), dir, status });
}

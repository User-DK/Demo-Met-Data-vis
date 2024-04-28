const { getRainfallData } = require('../admin/db');
import { NextResponse } from "next/server";

export async function GET(req) {
  return NextResponse.json(
    { error: "Method not allowed" },
    {
      status: 405
    }
  );
}

export async function POST(req, res) {
  try {
    const { state, district, year } = req.body;
    const data = await getRainfallData(state, district, year);
    return NextResponse.json(data, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch" },
      {
        status: 500,
      });
  }
}

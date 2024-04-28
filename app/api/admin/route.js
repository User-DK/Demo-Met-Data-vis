const { getStates, getYears, getDistricts, getMonths } = require('./db');
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
    const states = await getStates();
    const years = await getYears();
    // const months = await getMonths();
    const rawDistricts = await getDistricts();

    const allDistricts = rawDistricts.reduce((map, { state, district }) => {
      if (!map[state]) {
        map[state] = [];
      }
      map[state].push(district);
      return map;
    }, {});
    return NextResponse.json({ states, allDistricts, years}, {
      status: 200,
    });
    // res.status(200).json();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to get fetch" },
      {
        status: 500,
      });
  }
}

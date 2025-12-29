import { NextRequest, NextResponse } from "next/server";
import moment from "moment-timezone";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);

    const title = searchParams.get("title") || "Match Event";
    const startDate = searchParams.get("startDate");
    const description = searchParams.get("description") || "";
    const location = searchParams.get("location") || "";
    const url = searchParams.get("url") || "";

    if (!startDate) {
        return new NextResponse("Missing startDate", { status: 400 });
    }

    const start = moment.utc(startDate).format("YYYYMMDDTHHmmss[Z]");
    const end = moment
        .utc(startDate)
        .add(4, "hours")
        .format("YYYYMMDDTHHmmss[Z]");
    const now = moment().utc().format("YYYYMMDDTHHmmss[Z]");

    const cleanDescription = description.replace(/\n/g, "\\n");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Precision Hub//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${now}-${Math.random().toString(36).substr(2, 9)}@precisionhub.com
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:${title}
DESCRIPTION:${cleanDescription}
LOCATION:${location}
URL:${url}
END:VEVENT
END:VCALENDAR`;

    return new NextResponse(icsContent, {
        headers: {
            "Content-Type": "text/calendar; charset=utf-8",
            "Content-Disposition": `attachment; filename="${title.replace(/\s+/g, "_")}.ics"`,
        },
    });
}

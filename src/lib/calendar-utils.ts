import moment from "moment-timezone";

interface CalendarEvent {
  title: string;
  description: string;
  startDate: string; // ISO string
  location: string;
  url?: string;
  durationHours?: number;
}

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  // Assume event is in Utah (Mountain Time)
  const tz = "America/Denver";
  const start = moment.utc(event.startDate).tz(tz).format("YYYYMMDDTHHmmss");
  const end = moment
    .utc(event.startDate)
    .tz(tz)
    .add(event.durationHours || 4, "hours")
    .format("YYYYMMDDTHHmmss");

  const details = `${event.description}${event.url ? `\n\nMore info: ${event.url}` : ""}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: details,
    location: event.location,
    ctz: tz,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: CalendarEvent): string {
  // Outlook usually expects ISO strings. If we send UTC, it's safer.
  // 15:30 UTC = 8:30 AM MST.
  const start = moment.utc(event.startDate).format("YYYY-MM-DDTHH:mm:ss[Z]");
  const end = moment
    .utc(event.startDate)
    .add(event.durationHours || 4, "hours")
    .format("YYYY-MM-DDTHH:mm:ss[Z]");

  const details = `${event.description}${event.url ? `\n\nMore info: ${event.url}` : ""}`;

  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    startdt: start,
    enddt: end,
    subject: event.title,
    body: details,
    location: event.location,
  });

  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

export function getYahooCalendarUrl(event: CalendarEvent): string {
  // Yahoo is a bit tricky with timezones, sends Z is usually best.
  const start = moment.utc(event.startDate).format("YYYYMMDDTHHmmss[Z]");
  const end = moment
    .utc(event.startDate)
    .add(event.durationHours || 4, "hours")
    .format("YYYYMMDDTHHmmss[Z]");

  const details = `${event.description}${event.url ? `\n\nMore info: ${event.url}` : ""}`;

  const params = new URLSearchParams({
    v: "60",
    title: event.title,
    st: start,
    dur: "0400",
    et: end,
    desc: details,
    in_loc: event.location,
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

export function getIcsFileContent(event: CalendarEvent): string {
  // Use UTC times for ICS so it's unambiguous
  const start = moment.utc(event.startDate).format("YYYYMMDDTHHmmss[Z]");
  const end = moment
    .utc(event.startDate)
    .add(event.durationHours || 4, "hours")
    .format("YYYYMMDDTHHmmss[Z]");

  const now = moment().utc().format("YYYYMMDDTHHmmss[Z]");
  const details = `${event.description}${event.url ? `\\n\\nMore info: ${event.url}` : ""}`;
  const cleanDescription = details.replace(/\n/g, "\\n");

  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Precision Hub//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${now}-${Math.random().toString(36).substr(2, 9)}@precisionhub.com
DTSTAMP:${now}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.title}
DESCRIPTION:${cleanDescription}
LOCATION:${event.location}
URL:${event.url || ""}
END:VEVENT
END:VCALENDAR`;
}

export function getIcsApiUrl(event: CalendarEvent): string {
  const params = new URLSearchParams({
    title: event.title,
    startDate: event.startDate,
    description: event.description,
    location: event.location,
    url: event.url || "",
  });

  return `/api/calendar?${params.toString()}`;
}

export function downloadIcsFile(event: CalendarEvent) {
  const apiUrl = getIcsApiUrl(event);

  // On iOS, using the webcal:// protocol can be more reliable for triggering 
  // the "Add to Calendar" prompt for .ics files served via API.
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  if (isIOS) {
    // Construct an absolute URL and swap https for webcal
    const protocol = window.location.protocol;
    const host = window.location.host;
    const fullUrl = `${protocol}//${host}${apiUrl}`;
    const webcalUrl = fullUrl.replace(/^https?:/, "webcal:");
    window.location.href = webcalUrl;
  } else {
    window.location.href = apiUrl;
  }
}

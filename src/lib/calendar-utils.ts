import moment from "moment";

interface CalendarEvent {
  title: string;
  description: string;
  startDate: string; // ISO string
  location: string;
  url?: string;
  durationHours?: number;
}

export function getGoogleCalendarUrl(event: CalendarEvent): string {
  const start = moment(event.startDate).format("YYYYMMDDTHHmmss");
  const end = moment(event.startDate)
    .add(event.durationHours || 4, "hours")
    .format("YYYYMMDDTHHmmss");

  const details = `${event.description}${event.url ? `\n\nMore info: ${event.url}` : ""}`;

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    details: details,
    location: event.location,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function getOutlookCalendarUrl(event: CalendarEvent): string {
  const start = moment(event.startDate).format("YYYY-MM-DDTHH:mm:ss");
  const end = moment(event.startDate)
    .add(event.durationHours || 4, "hours")
    .format("YYYY-MM-DDTHH:mm:ss");

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
  const start = moment(event.startDate).format("YYYYMMDDTHHmmss");
  const end = moment(event.startDate)
    .add(event.durationHours || 4, "hours")
    .format("YYYYMMDDTHHmmss");

  // Yahoo specific description length limits sometimes apply, but we try standard
  const details = `${event.description}${event.url ? `\n\nMore info: ${event.url}` : ""}`;

  const params = new URLSearchParams({
    v: "60",
    title: event.title,
    st: start,
    dur: "0400",
    // Yahoo mostly supports 'et' or 'dur'.
    // Let's stick to 'et' (end time)
    et: end,
    desc: details,
    in_loc: event.location,
  });

  return `https://calendar.yahoo.com/?${params.toString()}`;
}

export function getIcsFileContent(event: CalendarEvent): string {
  // For ICS, it is safer to use UTC if possible to avoid client confusion,
  // BUT to be consistent with the "floating" fix above, we might want local time without TZ.
  // However, ICS floating time is just YYYYMMDDTHHmmss without 'Z'.

  const start = moment(event.startDate).format("YYYYMMDDTHHmmss");
  const end = moment(event.startDate)
    .add(event.durationHours || 4, "hours")
    .format("YYYYMMDDTHHmmss");

  const now = moment().utc().format("YYYYMMDDTHHmmss[Z]"); // DTSTAMP should be UTC
  const details = `${event.description}${event.url ? `\\n\\nMore info: ${event.url}` : ""}`;

  // Clean newlines for ICS
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

export function downloadIcsFile(event: CalendarEvent) {
  const content = getIcsFileContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const href = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = href;
  link.setAttribute("download", `${event.title.replace(/\s+/g, "_")}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

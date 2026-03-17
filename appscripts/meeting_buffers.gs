/**
 * Creates 15-minute private buffer events before and after 
 * external invitations, excluding solo events and removing notifications.
 */
function createMeetingBuffers() {
  const calendar = CalendarApp.getDefaultCalendar();
  const now = new Date();
  const futureDate = new Date(now.getTime() + (14 * 24 * 60 * 60 * 1000)); // Scan 14 days ahead
  const myEmail = Session.getActiveUser().getEmail();
  
  const events = calendar.getEvents(now, futureDate);
  const bufferDuration = 15 * 60 * 1000; // 15 minutes

  events.forEach(event => {
    const title = event.getTitle();
    const guestList = event.getGuestList();
    const creators = event.getCreators();
    const organizer = creators.length > 0 ? creators[0] : "";
    
    // LOGIC CHECK: 
    // 1. Is it a buffer we already created? (Skip)
    // 2. Is it an all-day event? (Skip)
    // 3. Did I create it AND am I the only guest? (skip)
    // 4. Is it the daily scrum call? (skip)
    const isBuffer = title.includes("Buffer");
    const isAllDay = event.isAllDayEvent();
    const isSoloEvent = (organizer === myEmail && guestList.length === 0);
    const isDailyScrum = title.includes("Daily Scrum");

    if (!isBuffer && !isAllDay && !isSoloEvent && !isDailyScrum) {
      const eventStart = event.getStartTime();
      const eventEnd = event.getEndTime();

      // --- BEFORE BUFFER ---
      const beforeStart = new Date(eventStart.getTime() - bufferDuration);
      createBufferIfMissing(calendar, "Buffer (Prep)", beforeStart, eventStart);

      // --- AFTER BUFFER ---
      const afterEnd = new Date(eventEnd.getTime() + bufferDuration);
      createBufferIfMissing(calendar, "Buffer (Wrap-up)", eventEnd, afterEnd);
    }
  });
}

/**
 * Helper to create a private event with NO notifications.
 */
function createBufferIfMissing(cal, title, start, end) {
  const existing = cal.getEvents(start, end).filter(e => e.getTitle() === title);
  
  if (existing.length === 0) {
    const newBuffer = cal.createEvent(title, start, end, {
      description: 'Automated meeting buffer.',
      visibility: CalendarApp.Visibility.PRIVATE
    });
    
    // Remove all default notifications (pop-ups and emails)
    newBuffer.removeAllReminders();
    
    console.log(`Created Silent Buffer: ${title} at ${start}`);
  }
}

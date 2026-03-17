const EVENT_TITLE = "🔒 Rolling Focus Block";
const HOURS_TO_BLOCK = 6;

function updateRollingBlock() {
  const calendar = CalendarApp.getDefaultCalendar();
  const now = new Date();
  
  // Calculate the end time (now + 8 hours)
  const endTime = new Date(now.getTime() + (HOURS_TO_BLOCK * 60 * 60 * 1000));
  
  // Define a search window to find and delete the old block
  // (Looking 1 day in the past to 2 days in the future to be safe)
  const searchStart = new Date(now.getTime() - (24 * 60 * 60 * 1000)); 
  const searchEnd = new Date(now.getTime() + (48 * 60 * 60 * 1000));
  
  const existingEvents = calendar.getEvents(searchStart, searchEnd);
  
  // Loop through events and delete any previous rolling blocks
  for (let i = 0; i < existingEvents.length; i++) {
    if (existingEvents[i].getTitle() === EVENT_TITLE) {
      existingEvents[i].deleteEvent();
    }
  }
  
// Create the new block for the next 8 hours
  const newEvent = calendar.createEvent(EVENT_TITLE, now, endTime);
  
  // Set the newly created event's visibility to Private
  newEvent.setVisibility(CalendarApp.Visibility.PRIVATE);
}

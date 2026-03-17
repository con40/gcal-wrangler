function colorCustomerCallsOrange() {
  // 1. Define your allowed domains
  const allowedDomains = ['gmail.com', 'okta.com', 'auth0.com'];
  
  // 2. Set the time window to check (Today to 30 days from now)
  const now = new Date();
  const futureDate = new Date();
  futureDate.setDate(now.getDate() + 30); 
  
  // 3. Get the events from your default calendar
  const calendar = CalendarApp.getDefaultCalendar();
  const events = calendar.getEvents(now, futureDate);
  
  // 4. Loop through each event
  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const guests = event.getGuestList();
    
    let hasExternalGuest = false;
    
    // 5. Check the email domain of each guest
    for (let j = 0; j < guests.length; j++) {
      const email = guests[j].getEmail().toLowerCase();
      
      // Extract the domain part of the email after the '@'
      const domain = email.substring(email.lastIndexOf("@") + 1);
      
      // If the domain is NOT in our allowed list, flag it
      if (!allowedDomains.includes(domain)) {
        hasExternalGuest = true;
        break; // Stop checking other guests for this event, we already found one
      }
    }
    
    // 6. Change the event color if an external guest was found
    if (hasExternalGuest) {
      // CalendarApp.EventColor.ORANGE corresponds to the standard Google Calendar orange
      event.setColor(CalendarApp.EventColor.ORANGE);
    }
  }
}

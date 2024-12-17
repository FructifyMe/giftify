import { createEvent, getEvents, getEvent, updateEvent, deleteEvent } from './events';

async function testEvents() {
  try {
    console.log('Creating test event...');
    const newEvent = await createEvent({
      title: 'Test Event',
      description: 'This is a test event',
      date: new Date().toISOString(),
    });
    console.log('Created event:', newEvent);

    console.log('\nFetching all events...');
    const events = await getEvents();
    console.log('All events:', events);

    console.log('\nFetching specific event...');
    const event = await getEvent(newEvent.id);
    console.log('Fetched event:', event);

    console.log('\nUpdating event...');
    const updatedEvent = await updateEvent(newEvent.id, {
      title: 'Updated Test Event',
    });
    console.log('Updated event:', updatedEvent);

    console.log('\nDeleting event...');
    await deleteEvent(newEvent.id);
    console.log('Event deleted successfully');

  } catch (error) {
    console.error('Error:', error);
  }
}

testEvents();

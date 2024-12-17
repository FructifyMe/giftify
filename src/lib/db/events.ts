import { supabase } from '@/lib/supabase/client';

export interface GiftEvent {
  id: string;
  title: string;
  description: string | null;
  date: string;
  created_by: string;
  group_id: string | null;
  created_at: string;
}

export interface CreateEventData {
  title: string;
  description?: string;
  date: string;
  group_id?: string;
}

export async function createEvent(data: CreateEventData): Promise<GiftEvent> {
  const { data: event, error } = await supabase
    .from('events')
    .insert({
      title: data.title,
      description: data.description,
      date: data.date,
      group_id: data.group_id,
      created_by: (await supabase.auth.getUser()).data.user?.id,
    })
    .select()
    .single();

  if (error) throw error;
  if (!event) throw new Error('Failed to create event');

  return event;
}

export async function getEvents(): Promise<GiftEvent[]> {
  const { data: events, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });

  if (error) throw error;
  return events || [];
}

export async function getEvent(id: string): Promise<GiftEvent> {
  const { data: event, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  if (!event) throw new Error('Event not found');

  return event;
}

export async function updateEvent(id: string, data: Partial<CreateEventData>): Promise<GiftEvent> {
  const { data: event, error } = await supabase
    .from('events')
    .update({
      title: data.title,
      description: data.description,
      date: data.date,
      group_id: data.group_id,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  if (!event) throw new Error('Event not found');

  return event;
}

export async function deleteEvent(id: string): Promise<void> {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

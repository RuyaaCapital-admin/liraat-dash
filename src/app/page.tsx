"use client";

import { EventForm } from "@/components/shadcn-big-calendar/event-form";
import ShadcnBigCalendar from "@/components/shadcn-big-calendar/shadcn-big-calendar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import moment from "moment";
import { SetStateAction, useState } from "react";
import { momentLocalizer, SlotInfo, Views } from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";

const DnDCalendar = withDragAndDrop(ShadcnBigCalendar);
const localizer = momentLocalizer(moment);

type Event = {
  title: string;
  start: Date;
  end: Date;
};

const LandingPage = () => {
  const [view, setView] = useState(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<SlotInfo | null>(null);

  const handleNavigate = (newDate: Date) => {
    setDate(newDate);
  };

  const handleViewChange = (newView: SetStateAction<any>) => {
    setView(newView);
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    setSelectedSlot(slotInfo);
  };

  const handleCreateEvent = (data: { title: string; start: string; end: string }) => {
    const newEvent = {
      title: data.title,
      start: new Date(data.start),
      end: new Date(data.end),
    };
    setEvents([...events, newEvent]);
    setSelectedSlot(null);
  };

  const handleEventDrop = ({ event, start, end }: any) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event
        ? { ...existingEvent, start, end }
        : existingEvent
    );
    setEvents(updatedEvents);
  };

  const handleEventResize = ({ event, start, end }: any) => {
    const updatedEvents = events.map((existingEvent) =>
      existingEvent === event
        ? { ...existingEvent, start, end }
        : existingEvent
    );
    setEvents(updatedEvents);
  };

  return (
    <main className="container my-auto">
      <div className="mb-4">
        <Button onClick={() => setSelectedSlot({ start: new Date(), end: new Date(), slots: [], action: 'click' })}>
          <Plus className="size-5 mr-2" />
          Create Event
        </Button>
      </div>
      <Dialog open={selectedSlot !== null} onOpenChange={() => setSelectedSlot(null)}>
        <DialogContent>
          <DialogHeader>
            <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">Create Event</h2>
          </DialogHeader>
          {selectedSlot && (
            <EventForm
              start={selectedSlot.start}
              end={selectedSlot.end}
              onSubmit={handleCreateEvent}
              onCancel={() => setSelectedSlot(null)}
            />
          )}
        </DialogContent>
      </Dialog>
      <DnDCalendar
        localizer={localizer}
        style={{ height: 600, width: "100%" }}
        className="border-border border-rounded-md border-solid border-2 rounded-lg" // Optional border
        selectable
        date={date}
        onNavigate={handleNavigate}
        view={view}
        onView={handleViewChange}
        resizable
        draggableAccessor={() => true}
        resizableAccessor={() => true}
        events={events}
        onSelectSlot={handleSelectSlot}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
      />
    </main>
  );
};

export default LandingPage;

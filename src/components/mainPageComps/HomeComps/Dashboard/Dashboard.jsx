import React, { useState, useEffect } from "react";
import "./Dashboard.scss";
import { recruitmentData } from "./data";
import ChartsSection from "./ChartsSection/ChartsSection";
import CalendarSection from "./CalendarSection/CalendarSection";
import SidebarSection from "./SidebarSection/SidebarSection";

const Dashboard = ({ setSelectedTitle, setSelectedChild }) => {
  const [events, setEvents] = useState(() => {
    const savedEvents = localStorage.getItem("events");
    const defaultEvents = [
      ...recruitmentData,
      {
        id: 6,
        title: "ثبت‌نام آزمون استخدامی برنامه‌نویسی",
        date: "1404/01/05",
        status: "در انتظار",
        isDefault: true,
      },
      {
        id: 7,
        title: "دریافت کارت آزمون برنامه‌نویسی",
        date: "1404/01/15",
        status: "در انتظار",
        isDefault: true,
      },
      {
        id: 8,
        title: "روز برگزاری آزمون برنامه‌نویسی",
        date: "1404/01/20",
        status: "در انتظار",
        isDefault: true,
      },
    ];
    return savedEvents ? JSON.parse(savedEvents) : defaultEvents;
  });

  useEffect(() => {
    localStorage.setItem("events", JSON.stringify(events));
  }, [events]);

  const handleAddEvent = (newEvent, dateStr, menuData) => {
    setEvents([
      ...events,
      {
        id: events.length + 1,
        title: newEvent,
        date: dateStr,
        isDefault: false,
        menuItem: menuData.menuItem,
        subMenu: menuData.subMenu,
      },
    ]);
  };

  const handleUpdateEvent = (newEvent, editingEvent) => {
    setEvents(
      events.map((event) =>
        event.id === editingEvent.id ? { ...event, title: newEvent } : event
      )
    );
  };

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  return (
    <div className="dashboard">
      <div className="top-section">
        <ChartsSection />
      </div>
      <div className="main-section">
        <div className="left-section">
          <CalendarSection
            events={events}
            onAddEvent={handleAddEvent}
            onUpdateEvent={handleUpdateEvent}
            onDeleteEvent={handleDeleteEvent}
            setSelectedTitle={setSelectedTitle}
            setSelectedChild={setSelectedChild}
          />
        </div>
        <div className="right-section">
          <SidebarSection events={events} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
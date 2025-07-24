"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { alertsManager, Alert, AlertNotification } from "@/lib/alerts";

interface AlertsContextType {
  alerts: Alert[];
  notifications: AlertNotification[];
  unreadCount: number;
  createAlert: (
    alertData: Omit<
      Alert,
      "id" | "createdAt" | "isTriggered" | "triggeredAt" | "notificationSent"
    >
  ) => Alert;
  updateAlert: (id: string, updates: Partial<Alert>) => Alert | null;
  deleteAlert: (id: string) => boolean;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  requestNotificationPermission: () => Promise<boolean>;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export function AlertsProvider({ children }: { children: React.ReactNode }) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [notifications, setNotifications] = useState<AlertNotification[]>([]);

  useEffect(() => {
    // Initialize data
    setAlerts(alertsManager.getAlerts());
    setNotifications(alertsManager.getNotifications());

    // Subscribe to changes
    const unsubscribe = alertsManager.subscribe(() => {
      setAlerts(alertsManager.getAlerts());
      setNotifications(alertsManager.getNotifications());
    });

    return unsubscribe;
  }, []);

  const contextValue: AlertsContextType = {
    alerts,
    notifications,
    unreadCount: alertsManager.getUnreadNotificationsCount(),
    createAlert: alertsManager.createAlert.bind(alertsManager),
    updateAlert: alertsManager.updateAlert.bind(alertsManager),
    deleteAlert: alertsManager.deleteAlert.bind(alertsManager),
    markNotificationAsRead:
      alertsManager.markNotificationAsRead.bind(alertsManager),
    markAllNotificationsAsRead:
      alertsManager.markAllNotificationsAsRead.bind(alertsManager),
    requestNotificationPermission:
      alertsManager.requestNotificationPermission.bind(alertsManager),
  };

  return (
    <AlertsContext.Provider value={contextValue}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const context = useContext(AlertsContext);
  if (context === undefined) {
    throw new Error("useAlerts must be used within an AlertsProvider");
  }
  return context;
}

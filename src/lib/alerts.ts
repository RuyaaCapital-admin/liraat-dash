"use client";

export interface Alert {
  id: string;
  title: string;
  description: string;
  notes: string;
  triggerTime: Date;
  currency: string;
  impact: "high" | "medium" | "low";
  isActive: boolean;
  isTriggered: boolean;
  triggeredAt?: Date;
  createdAt: Date;
  notificationSent: boolean;
}

export interface AlertNotification {
  id: string;
  alertId: string;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

class AlertsManager {
  private alerts: Alert[] = [];
  private notifications: AlertNotification[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
      this.startMonitoring();
    }
  }

  // Load alerts from localStorage
  private loadFromStorage() {
    try {
      const alertsData = localStorage.getItem('liirat-alerts');
      const notificationsData = localStorage.getItem('liirat-notifications');
      
      if (alertsData) {
        this.alerts = JSON.parse(alertsData).map((alert: any) => ({
          ...alert,
          triggerTime: new Date(alert.triggerTime),
          createdAt: new Date(alert.createdAt),
          triggeredAt: alert.triggeredAt ? new Date(alert.triggeredAt) : undefined,
        }));
      }
      
      if (notificationsData) {
        this.notifications = JSON.parse(notificationsData).map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp),
        }));
      }
    } catch (error) {
      console.error('Error loading alerts from storage:', error);
    }
  }

  // Save alerts to localStorage
  private saveToStorage() {
    try {
      localStorage.setItem('liirat-alerts', JSON.stringify(this.alerts));
      localStorage.setItem('liirat-notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving alerts to storage:', error);
    }
  }

  // Start monitoring for alerts
  private startMonitoring() {
    setInterval(() => {
      this.checkAlerts();
    }, 30000); // Check every 30 seconds
  }

  // Check if any alerts should be triggered
  private checkAlerts() {
    const now = new Date();
    let hasChanges = false;

    this.alerts.forEach(alert => {
      if (alert.isActive && !alert.isTriggered && alert.triggerTime <= now) {
        alert.isTriggered = true;
        alert.triggeredAt = now;
        alert.notificationSent = true;
        hasChanges = true;

        // Create notification
        this.createNotification(alert);
        
        // Send browser notification if permission granted
        this.sendBrowserNotification(alert);
      }
    });

    if (hasChanges) {
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  // Create a notification
  private createNotification(alert: Alert) {
    const notification: AlertNotification = {
      id: Date.now().toString(),
      alertId: alert.id,
      title: `Alert: ${alert.title}`,
      message: `${alert.description} at ${alert.triggerTime.toLocaleTimeString()}`,
      timestamp: new Date(),
      isRead: false,
    };

    this.notifications.unshift(notification);
    
    // Keep only last 50 notifications
    if (this.notifications.length > 50) {
      this.notifications = this.notifications.slice(0, 50);
    }
  }

  // Send browser notification
  private async sendBrowserNotification(alert: Alert) {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`Liirat News Alert: ${alert.title}`, {
        body: alert.description,
        icon: 'https://cdn.builder.io/api/v1/image/assets%2F8d6e2ebe2191474fb5a6de98317d4278%2Fae40207ed1d14041b2dc30fdddcc0531?format=webp&width=800',
        badge: 'https://cdn.builder.io/api/v1/image/assets%2F8d6e2ebe2191474fb5a6de98317d4278%2Fae40207ed1d14041b2dc30fdddcc0531?format=webp&width=800',
      });
    }
  }

  // Request notification permission
  async requestNotificationPermission(): Promise<boolean> {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }

  // Add event listener
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify all listeners
  private notifyListeners() {
    this.listeners.forEach(listener => listener());
  }

  // Public API methods
  createAlert(alertData: Omit<Alert, 'id' | 'createdAt' | 'isTriggered' | 'triggeredAt' | 'notificationSent'>): Alert {
    const alert: Alert = {
      ...alertData,
      id: Date.now().toString(),
      createdAt: new Date(),
      isTriggered: false,
      notificationSent: false,
    };

    this.alerts.push(alert);
    this.saveToStorage();
    this.notifyListeners();
    return alert;
  }

  updateAlert(id: string, updates: Partial<Alert>): Alert | null {
    const index = this.alerts.findIndex(alert => alert.id === id);
    if (index === -1) return null;

    this.alerts[index] = { ...this.alerts[index], ...updates };
    this.saveToStorage();
    this.notifyListeners();
    return this.alerts[index];
  }

  deleteAlert(id: string): boolean {
    const index = this.alerts.findIndex(alert => alert.id === id);
    if (index === -1) return false;

    this.alerts.splice(index, 1);
    this.saveToStorage();
    this.notifyListeners();
    return true;
  }

  getAlerts(): Alert[] {
    return [...this.alerts];
  }

  getActiveAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.isActive && !alert.isTriggered);
  }

  getTriggeredAlerts(): Alert[] {
    return this.alerts.filter(alert => alert.isTriggered);
  }

  getNotifications(): AlertNotification[] {
    return [...this.notifications];
  }

  markNotificationAsRead(id: string): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.isRead = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  markAllNotificationsAsRead(): void {
    this.notifications.forEach(notification => {
      notification.isRead = true;
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  clearOldNotifications(): void {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    this.notifications = this.notifications.filter(n => n.timestamp > oneWeekAgo);
    this.saveToStorage();
    this.notifyListeners();
  }
}

// Create singleton instance
export const alertsManager = new AlertsManager();

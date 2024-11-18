import React, { createContext, useContext, useState, useCallback } from "react";
import { notificationConfig } from "../config/notifications";
import { Toast } from "../components/ui/toast";

const NotificationContext = createContext({});

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((type, message, options = {}) => {
    const config = notificationConfig.types[type];
    const id = Date.now();

    const notification = {
      id,
      type,
      message,
      title: options.title || config.title,
      icon: config.icon,
      color: config.color,
      duration: options.duration || notificationConfig.defaultDuration,
      ...options,
    };

    setNotifications((current) => {
      const filtered = current.slice(
        -(notificationConfig.maxNotifications - 1)
      );
      return [...filtered, notification];
    });

    if (notification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearNotifications,
      }}
    >
      {children}
      <Toast notifications={notifications} onClose={removeNotification} />
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

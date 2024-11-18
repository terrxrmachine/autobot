import React from "react";
import * as Icons from "lucide-react";
import { notificationConfig } from "../../config/notifications";
import { cn } from "../../lib/utils";

export function Toast({ notifications, onClose }) {
  return (
    <div
      className={cn(
        "fixed z-50 flex flex-col gap-2 p-4",
        notificationConfig.position === "top-right" && "top-0 right-0",
        notificationConfig.position === "top-left" && "top-0 left-0",
        notificationConfig.position === "bottom-right" && "bottom-0 right-0",
        notificationConfig.position === "bottom-left" && "bottom-0 left-0"
      )}
    >
      {notifications.map((notification) => {
        const Icon = Icons[notification.icon];

        return (
          <div
            key={notification.id}
            className={cn(
              "relative flex items-center gap-3 rounded-lg p-4 shadow-lg",
              "animate-in slide-in-from-right",
              notification.color === "blue" && "bg-blue-50 text-blue-900",
              notification.color === "green" && "bg-green-50 text-green-900",
              notification.color === "red" && "bg-red-50 text-red-900",
              notification.color === "yellow" && "bg-yellow-50 text-yellow-900",
              notification.color === "orange" && "bg-orange-50 text-orange-900"
            )}
          >
            {Icon && (
              <div
                className={cn(
                  "rounded-full p-2",
                  notification.color === "blue" && "bg-blue-100",
                  notification.color === "green" && "bg-green-100",
                  notification.color === "red" && "bg-red-100",
                  notification.color === "yellow" && "bg-yellow-100",
                  notification.color === "orange" && "bg-orange-100"
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="font-medium">{notification.title}</h3>
              <p className="text-sm opacity-90">{notification.message}</p>
            </div>
            <button
              onClick={() => onClose(notification.id)}
              className="absolute top-1 right-1 p-1 opacity-60 hover:opacity-100"
            >
              <Icons.X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

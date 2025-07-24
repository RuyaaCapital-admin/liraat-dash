"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAlerts } from "@/components/alerts/alerts-provider";
import { useLanguage } from "@/components/language/language-provider";
import {
  AlertTriangle,
  Bell,
  Calendar,
  Edit,
  Plus,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export default function AlertsPage() {
  const { t, direction } = useLanguage();
  const { alerts, deleteAlert, updateAlert } = useAlerts();
  const [filter, setFilter] = useState<
    "all" | "active" | "triggered" | "inactive"
  >("all");

  const filteredAlerts = alerts.filter((alert) => {
    switch (filter) {
      case "active":
        return alert.isActive && !alert.isTriggered;
      case "triggered":
        return alert.isTriggered;
      case "inactive":
        return !alert.isActive;
      default:
        return true;
    }
  });

  const toggleAlertStatus = (alertId: string, currentStatus: boolean) => {
    updateAlert(alertId, { isActive: !currentStatus });
  };

  const getAlertStatusColor = (alert: any) => {
    if (alert.isTriggered) return "bg-red-500";
    if (alert.isActive) return "bg-green-500";
    return "bg-gray-500";
  };

  const getAlertStatusText = (alert: any) => {
    if (alert.isTriggered) return t("alerts.triggered");
    if (alert.isActive) return t("alerts.active");
    return t("alerts.inactive");
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 border-red-200";
      case "medium":
        return "text-yellow-600 border-yellow-200";
      case "low":
        return "text-green-600 border-green-200";
      default:
        return "text-gray-600 border-gray-200";
    }
  };

  return (
    <div
      className={`container mx-auto px-4 py-6 ${direction === "rtl" ? "rtl" : "ltr"}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
              <Bell className="w-8 h-8" />
              {t("alerts.title")}
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your economic event alerts and notifications
            </p>
          </div>
          <Link href="/alerts/create">
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              {t("alerts.createNew")}
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 border-b border-border">
          {[
            { key: "all", label: "All Alerts", count: alerts.length },
            {
              key: "active",
              label: t("alerts.active"),
              count: alerts.filter((a) => a.isActive && !a.isTriggered).length,
            },
            {
              key: "triggered",
              label: t("alerts.triggered"),
              count: alerts.filter((a) => a.isTriggered).length,
            },
            {
              key: "inactive",
              label: t("alerts.inactive"),
              count: alerts.filter((a) => !a.isActive).length,
            },
          ].map(({ key, label, count }) => (
            <Button
              key={key}
              variant={filter === key ? "default" : "ghost"}
              onClick={() => setFilter(key as any)}
              className="gap-2"
            >
              {label}
              <Badge variant="secondary" className="text-xs">
                {count}
              </Badge>
            </Button>
          ))}
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Bell className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                No alerts found
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first alert to get notified about important economic
                events.
              </p>
              <Link href="/alerts/create">
                <Button className="gap-2">
                  <Plus className="w-4 h-4" />
                  {t("alerts.createNew")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <Card key={alert.id} className="border-border/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className={`w-3 h-3 rounded-full ${getAlertStatusColor(alert)}`}
                        />
                        <CardTitle className="text-lg">{alert.title}</CardTitle>
                        <Badge
                          variant="outline"
                          className={getImpactColor(alert.impact)}
                        >
                          {alert.impact.toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.description}
                      </p>
                      {alert.notes && (
                        <div className="mt-2 p-2 bg-muted/50 rounded-md">
                          <p className="text-xs text-muted-foreground font-medium mb-1">
                            {t("alerts.notes")}:
                          </p>
                          <p className="text-sm">{alert.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          toggleAlertStatus(alert.id, alert.isActive)
                        }
                        disabled={alert.isTriggered}
                      >
                        {alert.isActive ? (
                          <PowerOff className="w-4 h-4" />
                        ) : (
                          <Power className="w-4 h-4" />
                        )}
                      </Button>
                      <Link href={`/alerts/edit/${alert.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteAlert(alert.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Currency
                      </p>
                      <p className="font-mono">{alert.currency}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        Status
                      </p>
                      <p>{getAlertStatusText(alert)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        {t("alerts.triggerTime")}
                      </p>
                      <p>{format(alert.triggerTime, "MMM dd, yyyy HH:mm")}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground font-medium">
                        {t("alerts.createdAt")}
                      </p>
                      <p>
                        {formatDistanceToNow(alert.createdAt, {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                  {alert.isTriggered && alert.triggeredAt && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-md">
                      <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-medium">
                          Alert triggered on{" "}
                          {format(alert.triggeredAt, "MMM dd, yyyy 'at' HH:mm")}
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

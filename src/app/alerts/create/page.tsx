"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useAlerts } from "@/components/alerts/alerts-provider";
import { useLanguage } from "@/components/language/language-provider";
import { AlertTriangle, Bell, Calendar, Plus } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateAlertPage() {
  const { t, direction } = useLanguage();
  const { createAlert, requestNotificationPermission } = useAlerts();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    notes: "",
    currency: "USD",
    impact: "medium" as "high" | "medium" | "low",
    triggerTime: "",
    isActive: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Request notification permission if not already granted
      await requestNotificationPermission();

      // Create the alert
      createAlert({
        title: formData.title,
        description: formData.description,
        notes: formData.notes,
        currency: formData.currency,
        impact: formData.impact,
        triggerTime: new Date(formData.triggerTime),
        isActive: formData.isActive,
      });

      // Redirect to alerts page
      router.push("/alerts");
    } catch (error) {
      console.error("Error creating alert:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high":
        return "text-red-600 border-red-200 bg-red-50 dark:bg-red-950/30";
      case "medium":
        return "text-yellow-600 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30";
      case "low":
        return "text-green-600 border-green-200 bg-green-50 dark:bg-green-950/30";
      default:
        return "text-gray-600 border-gray-200";
    }
  };

  const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY"];
  const impacts = [
    { value: "high", label: t("impact.highLabel") },
    { value: "medium", label: t("impact.mediumLabel") },
    { value: "low", label: t("impact.lowLabel") },
  ];

  // Generate default date/time (next hour)
  const defaultDateTime = new Date();
  defaultDateTime.setHours(defaultDateTime.getHours() + 1, 0, 0, 0);
  const defaultDateTimeString = defaultDateTime.toISOString().slice(0, 16);

  return (
    <div
      className={`container mx-auto px-4 py-6 max-w-2xl ${direction === "rtl" ? "rtl" : "ltr"}`}
    >
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-primary flex items-center gap-2">
            <Plus className="w-8 h-8" />
            {t("alerts.createNew")}
          </h1>
          <p className="text-muted-foreground mt-1">
            Set up alerts for important economic events and get notified in
            real-time
          </p>
        </div>

        {/* Notification Permission Notice */}
        {"Notification" in window && Notification.permission !== "granted" && (
          <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                <Bell className="w-4 h-4" />
                <span className="text-sm">
                  Browser notifications are disabled. Enable them to receive
                  real-time alerts.
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Alert Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">{t("alerts.form.title")} *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  placeholder="e.g., Fed Interest Rate Decision"
                  required
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">
                  {t("alerts.form.description")} *
                </Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Brief description of the event"
                  required
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">{t("alerts.form.notes")}</Label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Personal notes, trading strategy, or reminders..."
                  className="w-full min-h-[80px] px-3 py-2 text-sm border border-input bg-background rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                />
              </div>

              {/* Currency and Impact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">{t("alerts.form.currency")}</Label>
                  <select
                    id="currency"
                    value={formData.currency}
                    onChange={(e) =>
                      handleInputChange("currency", e.target.value)
                    }
                    className="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    {currencies.map((currency) => (
                      <option key={currency} value={currency}>
                        {currency}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label>{t("alerts.form.impact")}</Label>
                  <div className="flex gap-2">
                    {impacts.map(({ value, label }) => (
                      <Button
                        key={value}
                        type="button"
                        variant={
                          formData.impact === value ? "default" : "outline"
                        }
                        size="sm"
                        onClick={() => handleInputChange("impact", value)}
                        className={
                          formData.impact === value ? getImpactColor(value) : ""
                        }
                      >
                        {label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Trigger Time */}
              <div className="space-y-2">
                <Label htmlFor="triggerTime">
                  {t("alerts.form.triggerTime")} *
                </Label>
                <Input
                  id="triggerTime"
                  type="datetime-local"
                  value={formData.triggerTime || defaultDateTimeString}
                  onChange={(e) =>
                    handleInputChange("triggerTime", e.target.value)
                  }
                  min={new Date().toISOString().slice(0, 16)}
                  required
                />
              </div>

              {/* Active Status */}
              <div className="flex items-center space-x-2">
                <input
                  id="isActive"
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) =>
                    handleInputChange("isActive", e.target.checked)
                  }
                  className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
                />
                <Label htmlFor="isActive" className="text-sm">
                  Activate alert immediately
                </Label>
              </div>

              {/* Form Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={
                    isSubmitting || !formData.title || !formData.description
                  }
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : t("alerts.form.save")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/alerts")}
                >
                  {t("alerts.form.cancel")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

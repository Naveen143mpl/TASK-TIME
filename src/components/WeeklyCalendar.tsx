import { ScheduledTask } from "@/pages/Dashboard";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface WeeklyCalendarProps {
  scheduledTasks: ScheduledTask[];
}

export const WeeklyCalendar = ({ scheduledTasks }: WeeklyCalendarProps) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const getTasksForDay = (day: string) => {
    return scheduledTasks.filter((st) => st.day === day);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-l-destructive bg-destructive/5";
      case "medium":
        return "border-l-warning bg-warning/5";
      case "low":
        return "border-l-success bg-success/5";
      default:
        return "border-l-muted";
    }
  };

  if (scheduledTasks.length === 0) {
    return (
      <div className="flex items-center justify-center h-[500px] bg-muted/20 rounded-lg border-2 border-dashed border-border/50">
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-medium mb-2">No schedule generated yet</p>
          <p className="text-sm">Add tasks and click "Generate Schedule" to see your AI-optimized plan</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
      {days.map((day) => {
        const dayTasks = getTasksForDay(day);
        const isToday = day === days[new Date().getDay() - 1];

        return (
          <div
            key={day}
            className={`p-3 rounded-lg border-2 transition-smooth ${
              isToday
                ? "border-primary/50 bg-primary/5 shadow-soft"
                : "border-border/50 bg-card/50"
            }`}
          >
            <div className="mb-3 pb-2 border-b border-border/50">
              <h3 className={`font-semibold text-sm ${isToday ? "text-primary" : ""}`}>
                {day}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                {dayTasks.reduce((acc, st) => acc + st.task.estimatedHours, 0)}h scheduled
              </p>
            </div>

            <div className="space-y-2">
              {dayTasks.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No tasks</p>
              ) : (
                dayTasks.map((scheduledTask) => (
                  <div
                    key={scheduledTask.taskId}
                    className={`p-2 rounded border-l-4 ${getPriorityColor(
                      scheduledTask.task.priority
                    )} transition-smooth hover:shadow-soft`}
                  >
                    <h4 className="text-xs font-medium mb-1 line-clamp-2">
                      {scheduledTask.task.title}
                    </h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {scheduledTask.startTime} - {scheduledTask.endTime}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

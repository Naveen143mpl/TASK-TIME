import { Task } from "@/pages/Dashboard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Calendar as CalendarIcon, Trash2, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

interface TaskListProps {
  tasks: Task[];
  onDelete: (id: string) => void;
}

export const TaskList = ({ tasks, onDelete }: TaskListProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive text-destructive-foreground";
      case "medium":
        return "bg-warning text-warning-foreground";
      case "low":
        return "bg-success text-success-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-success/50 bg-success/5";
      case "scheduled":
        return "border-secondary/50 bg-secondary/5";
      default:
        return "border-border/50";
    }
  };

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No tasks yet. Add your first task to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg border-2 ${getStatusColor(task.status)} transition-smooth hover:shadow-soft`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-medium truncate">{task.title}</h3>
                {task.status === "scheduled" && (
                  <CheckCircle2 className="w-4 h-4 text-secondary flex-shrink-0" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-3 h-3" />
                  {format(new Date(task.deadline), "MMM dd, yyyy")}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {task.estimatedHours}h
                </div>
                <Badge className={`${getPriorityColor(task.priority)} text-xs`}>
                  {task.priority}
                </Badge>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(task.id)}
              className="flex-shrink-0 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

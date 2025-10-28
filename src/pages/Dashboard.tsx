import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Calendar, Plus, Settings, Sparkles } from "lucide-react";
import { TaskForm } from "@/components/TaskForm";
import { TaskList } from "@/components/TaskList";
import { WeeklyCalendar } from "@/components/WeeklyCalendar";
import { WorkingHoursDialog } from "@/components/WorkingHoursDialog";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  title: string;
  deadline: string;
  estimatedHours: number;
  priority: "low" | "medium" | "high";
  status: "pending" | "scheduled" | "completed";
}

export interface ScheduledTask {
  taskId: string;
  day: string;
  startTime: string;
  endTime: string;
  task: Task;
}

const Dashboard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [showWorkingHours, setShowWorkingHours] = useState(false);
  const [workingHours, setWorkingHours] = useState({ start: "09:00", end: "18:00" });
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleAddTask = (task: Omit<Task, "id" | "status">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      status: "pending",
    };
    setTasks([...tasks, newTask]);
    setShowTaskForm(false);
    toast({
      title: "Task added",
      description: "Your task has been added successfully.",
    });
  };

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    setScheduledTasks(scheduledTasks.filter((st) => st.taskId !== id));
    toast({
      title: "Task deleted",
      description: "Task has been removed from your schedule.",
    });
  };

  const handleGenerateSchedule = async () => {
    if (tasks.filter(t => t.status === "pending").length === 0) {
      toast({
        title: "No tasks to schedule",
        description: "Please add some tasks before generating a schedule.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation for now
    setTimeout(() => {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
      const newSchedule: ScheduledTask[] = [];
      let currentDay = 0;
      let currentHour = parseInt(workingHours.start.split(":")[0]);
      
      tasks.filter(t => t.status === "pending").forEach((task) => {
        const endHour = currentHour + task.estimatedHours;
        const workEndHour = parseInt(workingHours.end.split(":")[0]);
        
        if (endHour > workEndHour) {
          currentDay++;
          currentHour = parseInt(workingHours.start.split(":")[0]);
        }
        
        if (currentDay < days.length) {
          newSchedule.push({
            taskId: task.id,
            day: days[currentDay],
            startTime: `${currentHour.toString().padStart(2, '0')}:00`,
            endTime: `${(currentHour + task.estimatedHours).toString().padStart(2, '0')}:00`,
            task,
          });
          
          currentHour += task.estimatedHours;
        }
      });

      setScheduledTasks(newSchedule);
      setTasks(tasks.map(t => 
        newSchedule.find(st => st.taskId === t.id) 
          ? { ...t, status: "scheduled" as const }
          : t
      ));
      setIsGenerating(false);
      
      toast({
        title: "Schedule generated!",
        description: "AI has created your optimal weekly schedule.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-ai flex items-center justify-center shadow-glow">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-ai bg-clip-text text-transparent">
                 Task Time
                </h1>
                <p className="text-sm text-muted-foreground">Context-Aware Scheduling</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowWorkingHours(true)}
                className="hidden sm:flex"
              >
                <Settings className="w-4 h-4 mr-2" />
                Working Hours
              </Button>
              <Button
                onClick={() => setShowTaskForm(true)}
                className="bg-gradient-primary hover:opacity-90 shadow-soft"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Tasks */}
          <div className="lg:col-span-1 space-y-4">
            <Card className="p-6 shadow-soft border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Your Tasks</h2>
                <span className="text-sm text-muted-foreground">
                  {tasks.filter(t => t.status === "pending").length} pending
                </span>
              </div>
              <TaskList tasks={tasks} onDelete={handleDeleteTask} />
            </Card>

            <Card className="p-6 shadow-soft border-border/50 bg-gradient-ai">
              <div className="flex items-center gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-white" />
                <h3 className="font-semibold text-white">AI Scheduler</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">
                Let AI create an optimized weekly schedule based on your tasks and working hours.
              </p>
              <Button
                onClick={handleGenerateSchedule}
                disabled={isGenerating}
                className="w-full bg-white text-primary hover:bg-white/90"
              >
                {isGenerating ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-pulse-glow" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Calendar className="w-4 h-4 mr-2" />
                    Generate Schedule
                  </>
                )}
              </Button>
            </Card>
          </div>

          {/* Right Column - Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-soft border-border/50">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Weekly Schedule</h2>
                <div className="text-sm text-muted-foreground">
                  {workingHours.start} - {workingHours.end}
                </div>
              </div>
              <WeeklyCalendar scheduledTasks={scheduledTasks} />
            </Card>
          </div>
        </div>
      </main>

      {/* Dialogs */}
      <TaskForm
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        onSubmit={handleAddTask}
      />
      <WorkingHoursDialog
        open={showWorkingHours}
        onClose={() => setShowWorkingHours(false)}
        workingHours={workingHours}
        onSave={setWorkingHours}
      />
    </div>
  );
};

export default Dashboard;

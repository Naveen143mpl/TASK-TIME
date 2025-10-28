import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Clock } from "lucide-react";

interface WorkingHoursDialogProps {
  open: boolean;
  onClose: () => void;
  workingHours: { start: string; end: string };
  onSave: (hours: { start: string; end: string }) => void;
}

export const WorkingHoursDialog = ({
  open,
  onClose,
  workingHours,
  onSave,
}: WorkingHoursDialogProps) => {
  const [hours, setHours] = useState(workingHours);

  useEffect(() => {
    setHours(workingHours);
  }, [workingHours]);

  const handleSave = () => {
    onSave(hours);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Working Hours
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            Set your preferred working hours. AI will schedule tasks within this timeframe.
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start Time</Label>
              <Input
                id="start"
                type="time"
                value={hours.start}
                onChange={(e) => setHours({ ...hours, start: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">End Time</Label>
              <Input
                id="end"
                type="time"
                value={hours.end}
                onChange={(e) => setHours({ ...hours, end: e.target.value })}
              />
            </div>
          </div>

          <div className="p-3 bg-accent rounded-lg">
            <p className="text-sm text-accent-foreground">
              <span className="font-medium">Daily capacity:</span>{" "}
              {parseInt(hours.end.split(":")[0]) - parseInt(hours.start.split(":")[0])} hours
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 bg-gradient-primary">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

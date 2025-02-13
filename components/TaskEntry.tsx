// components/TaskEntry.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { TaskEntryProps } from '../types/worksheet';

export const TaskEntry: React.FC<TaskEntryProps> = ({
  entry,
  index,
  onEntryChange,
  onRemove,
  canRemove
}) => {
  return (
    <div className="flex gap-4 items-start">
      <div className="w-1/3">
        <Input
          type="date"
          value={entry.date}
          onChange={(e) => onEntryChange(index, 'date', e.target.value)}
          className="w-full"
          required
        />
      </div>
      <div className="flex-1">
        <Input
          value={entry.task}
          onChange={(e) => onEntryChange(index, 'task', e.target.value)}
          placeholder="Enter task description"
          className="w-full"
          required
        />
      </div>
      {canRemove && (
        <Button 
          type="button"
          variant="destructive"
          size="icon"
          onClick={() => onRemove(index)}
          className="flex-shrink-0"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
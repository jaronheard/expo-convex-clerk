import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { WorkflowId } from "@convex-dev/workflow";
import { useQuery } from "convex-helpers/react/cache";
import { useMutation } from "convex/react";
import { useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Text } from "./ui/text";

interface TaskItemProps {
  id: Id<"tasks">;
  text: string;
  isCompleted: boolean;
}

interface TaskType {
  _id: Id<"tasks">;
  _creationTime: number;
  text: string;
  isCompleted: boolean;
}

export function TaskItem({ id, text, isCompleted }: TaskItemProps) {
  const toggleTask = useMutation(api.tasks.toggleTask).withOptimisticUpdate(
    (localStore, args) => {
      const { id, isCompleted } = args;

      // We need to handle all possible search queries that might be active
      // First, try with empty search query (default view)
      const defaultQueries = localStore.getAllQueries(api.tasks.search);

      for (const { args: queryArgs, value } of defaultQueries) {
        if (value && value.page) {
          const updatedResults = {
            ...value,
            page: value.page.map((task: TaskType) =>
              task._id === id ? { ...task, isCompleted } : task,
            ),
          };

          localStore.setQuery(api.tasks.search, queryArgs, updatedResults);
        }
      }
    },
  );
  const splitTask = useMutation(api.tasks.splitTask);
  const [workflowId, setWorkflowId] = useState<WorkflowId | null>(null);
  const workflowStatus = useQuery(
    api.tasks.getTaskSplitWorkflowStatus,
    workflowId ? { workflowId } : "skip",
  );

  const handleSplitTask = async () => {
    try {
      const result = await splitTask({ text });
      setWorkflowId(result);
    } catch (error) {
      console.error("Failed to split task:", error);
    }
  };

  const isWorkflowLoading = Boolean(
    workflowId && (!workflowStatus || workflowStatus.type === "inProgress"),
  );
  const isWorkflowCompleted = workflowStatus?.type === "completed";

  return (
    <View className="flex-row items-center p-4 rounded-lg bg-background">
      <Checkbox
        checked={isCompleted}
        onCheckedChange={() => toggleTask({ id, isCompleted: !isCompleted })}
        className="mr-3"
      />
      <Text className={cn(isCompleted && "line-through opacity-50")}>
        {text}
      </Text>
      <Button
        onPress={handleSplitTask}
        disabled={isWorkflowLoading}
        variant="secondary"
        size="sm"
        className="ml-auto"
      >
        {isWorkflowLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : isWorkflowCompleted ? (
          <Text>Completed</Text>
        ) : (
          <Text>Split</Text>
        )}
      </Button>
    </View>
  );
}

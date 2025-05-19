import { Colors } from "@/constants/Colors";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { WorkflowId } from "@convex-dev/workflow";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
} from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";

interface TaskItemProps {
  id: Id<"tasks">;
  text: string;
  isCompleted: boolean;
}

export function TaskItem({ id, text, isCompleted }: TaskItemProps) {
  const colorScheme = useColorScheme();
  const toggleTask = useMutation(api.tasks.toggleTask);
  const splitTask = useMutation(api.tasks.splitTask);
  const [workflowId, setWorkflowId] = useState<WorkflowId | null>(null);
  const workflowStatus = useQuery(
    api.tasks.getTaskSplitWorkflowStatus,
    workflowId ? { workflowId } : "skip"
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
    workflowId && (!workflowStatus || workflowStatus.type === "inProgress")
  );
  const isWorkflowCompleted = workflowStatus?.type === "completed";

  return (
    <ThemedView style={styles.taskItem}>
      <TouchableOpacity
        onPress={() => toggleTask({ id, isCompleted: !isCompleted })}
        style={styles.checkbox}
      >
        <MaterialIcons
          name={isCompleted ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={colorScheme === "dark" ? Colors.dark.icon : Colors.light.icon}
        />
      </TouchableOpacity>
      <ThemedText style={isCompleted ? styles.completedTask : undefined}>
        {text}
      </ThemedText>
      <TouchableOpacity
        onPress={() => handleSplitTask()}
        style={[
          styles.splitButton,
          isWorkflowLoading && styles.splitButtonLoading,
        ]}
        disabled={isWorkflowLoading}
      >
        {isWorkflowLoading && <ActivityIndicator size="small" color="#fff" />}
        {isWorkflowCompleted && (
          <ThemedText style={styles.splitButtonText}>Completed</ThemedText>
        )}
        {!isWorkflowLoading && !isWorkflowCompleted && (
          <ThemedText style={styles.splitButtonText}>Split</ThemedText>
        )}
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  taskItem: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 12,
  },
  completedTask: {
    textDecorationLine: "line-through",
    opacity: 0.7,
  },
  splitButton: {
    marginLeft: "auto",
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: "#007AFF",
    borderRadius: 4,
    minWidth: 48,
    alignItems: "center",
  },
  splitButtonLoading: {
    opacity: 0.7,
  },
  splitButtonText: {
    color: "#fff",
    fontSize: 12,
  },
});

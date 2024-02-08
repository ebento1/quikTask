import ActivityLog from "../../models/entity/activity_log.js";

// Function to add an entry to the activity log
const logActivity = async (
  userId,
  tableName,
  rowChangedTable,
  action,
  content
) => {
  try {
    await ActivityLog.create({
      user_id: userId,
      table_name: tableName,
      row_changed_table: rowChangedTable,
      action: action,
      content: JSON.stringify(content),
    });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export { logActivity };

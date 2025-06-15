// utils/helpers.js
export const generateId = () => Math.random().toString(36).substr(2, 9)

export const sendEmailInvite = async (email, taskTitle, senderName) => {
  // Simulate email sending - in real app, this would call your backend API
  console.log(`Sending email invite to ${email} for task "${taskTitle}" from ${senderName}`)

  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Return success response
  return {
    success: true,
    message: `Invitation sent to ${email}`,
  }
}

export const exportToCSV = (tasks) => {
  const headers = ["Title", "Description", "Category", "Priority", "Due Date", "Status", "Tags", "Shared With"]
  const csvContent = [
    headers.join(","),
    ...tasks.map((task) =>
      [
        `"${task.title}"`,
        `"${task.description}"`,
        task.category,
        task.priority,
        task.dueDate,
        task.completed ? "Completed" : "Pending",
        task.tags.join("; "),
        task.sharedEmails.join("; "),
      ].join(","),
    ),
  ].join("\n")

  const blob = new Blob([csvContent], { type: "text/csv" })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "tasks.csv"
  a.click()
  window.URL.revokeObjectURL(url)
}
export const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return "Just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  export const getNotificationIcon = (type) => {
      const colors = {
        feedback_submitted: "#4CAF50",
        alert: "#FF9800",
        info: "#2196F3",
        warning: "#F44336",
      };
      return colors[type] || "#9E9E9E";
    };

  export const formatRole = (value = "") => {
  return value
    .replace(/_/g, " ")
    .toUpperCase();
};

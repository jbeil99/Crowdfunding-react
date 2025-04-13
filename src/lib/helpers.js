export const calculateDaysLeft = (campaign) => {
    if (!campaign.end_time) return "N/A";
    const endDate = new Date(campaign.end_time);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };
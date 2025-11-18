export const formatDateTime = (iso) => {
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };
  
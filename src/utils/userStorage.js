export const getUserStorageKey = (key) => {
  const currentUser = JSON.parse(
    localStorage.getItem("moodGardenCurrentUser") || "null",
  );

  if (!currentUser?.id) return null;

  return `${key}_${currentUser.id}`;
};

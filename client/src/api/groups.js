export async function fetchCreateNewGroup() {
  const group = await fetch("/api/groups/new", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await group.json();
}

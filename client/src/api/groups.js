import { getApiHost } from "./api";

export async function fetchCreateNewGroup() {
  const group = await fetch(getApiHost("/groups/new"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await group.json();
}

import api from "./api";

export async function getStats() {
  const { data } = await api.get("/admin/stats");
  return data.stats;
}

export async function getUsers(role) {
  const { data } = await api.get("/admin/users", { params: role ? { role } : {} });
  return data.users;
}

export async function getNgos(status) {
  const { data } = await api.get("/admin/ngos", { params: status ? { status } : {} });
  return data.ngos;
}

export async function approveNgo(id) {
  const { data } = await api.patch(`/admin/ngos/${id}/approve`);
  return data.ngoProfile;
}

export async function rejectNgo(id, note) {
  const { data } = await api.patch(`/admin/ngos/${id}/reject`, { note });
  return data.ngoProfile;
}

export async function getAllDonations(status) {
  const { data } = await api.get("/admin/donations", { params: status ? { status } : {} });
  return data.donations;
}

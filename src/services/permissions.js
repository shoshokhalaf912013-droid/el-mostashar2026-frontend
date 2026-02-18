// services/permissions.js

// ======================================
// ROLE HELPERS
// ======================================

const getRole = (userData) => {
  return userData?.role?.toLowerCase?.() || null;
};

export const isSuperAdmin = (userData) => {
  if (!userData) return false;

  return (
    userData.isSuperAdmin === true ||
    getRole(userData) === "super-admin"
  );
};

// ======================================
// CONTENT PERMISSIONS
// ======================================

// ✅ إدارة المحتوى (إضافة + تعديل)
export const canManageContent = (userData) => {
  if (!userData) return false;

  if (isSuperAdmin(userData)) return true;

  const role = getRole(userData);

  const allowedRoles = new Set([
    "admin",
    "teacher",
  ]);

  return allowedRoles.has(role);
};

// ✅ الإضافة
export const canAddContent = (userData) => {
  return canManageContent(userData);
};

// ✅ التعديل
export const canEditContent = (userData) => {
  return canManageContent(userData);
};

// ❌ الحذف — سوبر فقط
export const canDeleteContent = (userData) => {
  return isSuperAdmin(userData);
};

// ❌ التعطيل — سوبر فقط
export const canDisableContent = (userData) => {
  return isSuperAdmin(userData);
};

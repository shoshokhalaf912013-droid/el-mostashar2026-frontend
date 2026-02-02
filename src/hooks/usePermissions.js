// hooks/usePermissions.js
export function usePermissions(userRole) {
  const role = roles[userRole]; // من فايربيز

  return {
    canEditFlow: role?.canEditLessonFlow,
    canToggleLesson: role?.canToggleLessonActive,
    canDeleteLesson: role?.canDeleteLesson,
  };
}

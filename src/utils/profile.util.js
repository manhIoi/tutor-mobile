export const checkIsTeacher = (user) => {
    return user?.role === 'teacher';
}
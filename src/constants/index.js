export default {
  teachingType: [
    {
      _id: 0,
      name: 'Offline',
    },
    {
      _id: 1,
      name: 'Online'
    }
  ],
  STATUS_CLASS: {
    pending: 'Đang chờ duyệt',
    upcoming: 'Sắp diễn ra',
    wait_start: 'Chờ mở đăng ký',
    ongoing: 'Đang diễn ra',
    finished: 'Đã kết thúc',
    rejected: 'Bị từ chối',
    deleted: 'Đã xóa',
  },
  STATUS_CLASS_COLOR: {
    pending: '#25A053',
    wait_start: '#25A053',
    upcoming: '#FFB02C',
    ongoing: '#FFB02C',
    finished: '#EE6423',
    rejected: '#EE6423',
    deleted: '#FFF',
  },
  TYPE_OF_TEACHER: {
    0: 'Đang là học sinh, sinh viên',
    1: 'Đang là giáo viên',
    2: 'Đã đi làm',
  }
}
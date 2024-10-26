export function createMessage(template: string, ...params: any[]): string {
  return template.replace(/\${(\d)}/g, (match, index) => params[index]);
}
export function formatJapaneseDate(dateStr?: string): string {
  if (!dateStr) return '';

  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
  const day = date.getDate();
  const dayOfWeek = date.getDay(); // Lấy ngày trong tuần (0 là Chủ Nhật, 1 là Thứ 2, và cứ tiếp tục)

  // Mảng về ngày trong tuần bằng tiếng Nhật
  const japaneseWeekdays = ['日', '月', '火', '水', '木', '金', '土'];

  const formattedDate = `${year}年${month}月${day}日(${japaneseWeekdays[dayOfWeek]})`;

  return formattedDate;
}

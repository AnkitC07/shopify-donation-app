import * as XLSX from "xlsx";

export const exportFunc = (data, headings, exptloadingState) => {
  exptloadingState(true);

  //   const worksheet = XLSX.utils.json_to_sheet(products);
  const worksheet = XLSX.utils.aoa_to_sheet([headings, ...data]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  // Convert the workbook to a buffer
  const excelBuffer = XLSX.write(workbook, { type: "array" });

  // Save the XLSX file
  const fileName = "Sheet.xlsx";
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  exptloadingState(false);
};

export const downloadFile = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  document.body.appendChild(a);
  a.click();
};

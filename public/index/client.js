/* $(() => {
  $('btnSubmit').on('click', () => {
    const file = document.getElementById('fileInput').files[0];
    console.log(file);
  });
});
 */

function printFile() {
  const file = document.getElementById('fileInput').files[0];
  console.log(file);
  fetch('/api/files', {
    headers: { 'content-type': 'application/json' },
    method: 'POST',
    body: file,
  })
    .then((value) => {
      return value.json();
    })
    .catch((err) => console.log(err));
}

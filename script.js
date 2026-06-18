(function(){
  const year = document.getElementById('year');
  if(year) year.textContent = new Date().getFullYear();

  const themeToggle = document.getElementById('themeToggle');
  const themes = ['theme-1','theme-2','theme-3'];
  let idx = 0;
  themeToggle && themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.remove(...themes);
    idx = (idx+1) % themes.length;
    document.documentElement.classList.add(themes[idx]);
  });

  const copyEmail = document.getElementById('copyEmail');
  copyEmail && copyEmail.addEventListener('click', (e)=>{
    e.preventDefault();
    const email = 'alex.morgan@example.com';
    navigator.clipboard?.writeText(email).then(()=>{
      const old = copyEmail.textContent;
      copyEmail.textContent = 'Email copied ✓';
      setTimeout(()=> copyEmail.textContent = old, 1800);
    }).catch(()=>{
      alert('Could not copy automatically — email: ' + email);
    });
  });
})();

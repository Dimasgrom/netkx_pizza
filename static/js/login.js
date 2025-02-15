const loginInput = document.getElementById('login');
const passwordInput = document.getElementById('password');
const rememberCheckbox = document.getElementById('remember');
const signinBtn = document.querySelector('.signin-btn');

// Загрузка сохраненных данных
window.onload = function() {
    const savedLogin = localStorage.getItem('rememberLogin');
    const savedPassword = localStorage.getItem('rememberPassword');
    
    if(savedLogin && savedPassword) {
        loginInput.value = savedLogin;
        passwordInput.value = savedPassword;
        rememberCheckbox.checked = true;
    }
};

// Обработчик входа
signinBtn.addEventListener('click', function() {
    if(rememberCheckbox.checked) {
        // Сохраняем данные
        localStorage.setItem('rememberLogin', loginInput.value);
        localStorage.setItem('rememberPassword', passwordInput.value);
    } else {
        // Удаляем сохраненные данные
        localStorage.removeItem('rememberLogin');
        localStorage.removeItem('rememberPassword');
    }
    
    // Здесь должна быть логика авторизации
    alert('Login attempt: ' + loginInput.value);
});

document.getElementById("pizza-bulder")?.addEventListener("click", () => {
    window.location.href = "pizza_construkt.html";
  });
  
  document.getElementById("logo")?.addEventListener("click", () => {
    window.location.href = "index.html";
  });
  
  document.getElementById("login")?.addEventListener("click", () => {
      window.location.href = "login.html";
    });
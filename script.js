document.addEventListener('DOMContentLoaded', function() {
    const headerBurger = document.querySelector('.header-burger');
    const headerMain = document.querySelector('.header-main');
    const navMenu = document.querySelector('.nav-menu');
    const login = document.querySelector('.login');
    const body = document.body;
    const background = document.querySelector('.body');

    headerBurger.addEventListener('click', function() {
        headerBurger.classList.toggle('active');
        headerMain.classList.toggle('active');
        navMenu.classList.toggle('active');
        login.classList.toggle('active');
        body.classList.toggle('lock');

    });

    headerMain.addEventListener('click', function(e) {
        if (e.target === headerMain) {
            headerBurger.classList.remove('active');
            headerMain.classList.remove('active');
            navMenu.classList.remove('active');
            login.classList.remove('active');
            body.classList.remove('lock');
        }
    });

    const menuItems = document.querySelectorAll('.nav-menu li');
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            headerBurger.classList.remove('active');
            headerMain.classList.remove('active');
            navMenu.classList.remove('active');
            login.classList.remove('active');
            body.classList.remove('lock');
        });
    });
});
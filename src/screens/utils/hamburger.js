document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    body.appendChild(overlay);

    let scrollPosition = 0;

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        overlay.classList.toggle('active');
        
        if (!body.classList.contains('menu-open')) {
            scrollPosition = window.pageYOffset;
            body.classList.add('menu-open');
            body.style.top = `-${scrollPosition}px`;
        } else {
            body.classList.remove('menu-open');
            body.style.top = '';
            window.scrollTo(0, scrollPosition);
        }
    });

    overlay.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        overlay.classList.remove('active');
        
        body.classList.remove('menu-open');
        body.style.top = '';
        window.scrollTo(0, scrollPosition);
    });

    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', (event) => {
            const target = event.target.innerText;
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            overlay.classList.remove('active');
            
            body.classList.remove('menu-open');
            body.style.top = '';
            window.scrollTo(0, scrollPosition);

            if (target === 'Simulasi') {
                navigation.navigate('Simulation');
            }
        });
    });
});

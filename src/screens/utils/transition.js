document.addEventListener('DOMContentLoaded', () => {
    const transitionElement = document.createElement('div');
    transitionElement.className = 'page-transition';
    document.body.appendChild(transitionElement);

    const handlePageTransition = (e) => {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            if (link.href && link.href.indexOf(window.location.origin) > -1) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetUrl = this.href;
                    const mainContent = document.querySelector('main');
                    mainContent.classList.add('fade-out');
                    transitionElement.style.transform = 'translateX(0)';
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 500);
                });
            }
        });
    };

    handlePageTransition();

    window.addEventListener('popstate', () => {
        const mainContent = document.querySelector('main');
        mainContent.classList.add('fade-out');
        transitionElement.style.transform = 'translateX(0)';
    });

    window.addEventListener('load', () => {
        const mainContent = document.querySelector('main');
        mainContent.classList.remove('fade-out');
        transitionElement.style.transform = 'translateX(100%)';
    });
});

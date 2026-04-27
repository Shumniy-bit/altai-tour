document.addEventListener('DOMContentLoaded', function() {
    
    // ========== БУРГЕР-МЕНЮ ==========
    const burgerMenu = document.querySelector('.burger-menu');
    const headerNav = document.querySelector('.header__nav');
    
    // Создаем overlay для мобильного меню
    const overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    document.body.appendChild(overlay);
    
    // Функция для управления состоянием body (блокировка скролла)
    function toggleBodyScroll(disable) {
        document.body.style.overflow = disable ? 'hidden' : '';
    }

    if (burgerMenu) {
        burgerMenu.addEventListener('click', function() {
            const isActive = !this.classList.contains('active');
            this.classList.toggle('active');
            headerNav.classList.toggle('active');
            overlay.classList.toggle('active');
            
            toggleBodyScroll(isActive);
            
            const isExpanded = this.classList.contains('active');
            this.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Закрытие меню при клике на overlay
    overlay.addEventListener('click', function() {
        burgerMenu.classList.remove('active');
        headerNav.classList.remove('active');
        overlay.classList.remove('active');
        toggleBodyScroll(false);
        burgerMenu.setAttribute('aria-expanded', 'false');
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.header__li_a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (!headerNav.classList.contains('active')) return;
            
            burgerMenu.classList.remove('active');
            headerNav.classList.remove('active');
            overlay.classList.remove('active');
            toggleBodyScroll(false);
            burgerMenu.setAttribute('aria-expanded', 'false');
        });
    });
    
    // ========== ПЛАВНАЯ ПРОКРУТКА К СЕКЦИЯМ ==========
    const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '') return;
            
            const targetElement = document.querySelector(href);
            if (targetElement) {
                e.preventDefault();
                
                // Закрываем мобильное меню
                if (headerNav && headerNav.classList.contains('active')) {
                    burgerMenu.classList.remove('active');
                    headerNav.classList.remove('active');
                    overlay.classList.remove('active');
                    toggleBodyScroll(false);
                    burgerMenu.setAttribute('aria-expanded', 'false');
                }
                
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                history.pushState(null, null, href);
            }
        });
    });
    
    // ========== ПОДСВЕТКА АКТИВНОГО ПУНКТА МЕНЮ ПРИ ПРОКРУТКЕ ==========
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavigation() {
        const scrollPosition = window.scrollY + document.querySelector('.header').offsetHeight + 50;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                const currentId = '#' + section.getAttribute('id');
                
                navLinks.forEach(link => {
                    link.classList.remove('active-link');
                    if (link.getAttribute('href') === currentId) {
                        link.classList.add('active-link');
                    }
                });
            }
        });
        
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active-link');
                if (link.getAttribute('href') === '#home') {
                    link.classList.add('active-link');
                }
            });
        }
    }
    
    // УДАЛЕН БЛОК СОЗДАНИЯ СТИЛЕЙ ЧЕРЕЗ JS (АНТИПАТТЕРН)
    
    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation();
    
    // ========== ЗАКРЫТИЕ МЕНЮ ПРИ РЕСАЙЗЕ (исправлена блокировка скролла) ==========
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (headerNav.classList.contains('active')) {
                burgerMenu.classList.remove('active');
                headerNav.classList.remove('active');
                overlay.classList.remove('active');
                toggleBodyScroll(false); // ВАЖНО: возвращаем скролл
                burgerMenu.setAttribute('aria-expanded', 'false');
            }
        }
    });
    
    // ========== АНИМАЦИЯ ПОЯВЛЕНИЯ ЭЛЕМЕНТОВ ПРИ ПРОКРУТКЕ ==========
    const animateElements = document.querySelectorAll('.card, .tour__card, .reviews__card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // ========== ВАЛИДАЦИЯ ФОРМЫ (УЛУЧШЕННЫЙ UX) ==========
    const contactForm = document.querySelector('.contact-form');
    const feedbackBlock = document.getElementById('form-feedback');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const messageInput = document.getElementById('message');
            
            let isValid = true;
            let errorMessage = '';
            
            // Сброс стилей и ошибок
            [nameInput, emailInput, messageInput].forEach(input => {
                if (input) input.style.borderBottomColor = '#fff';
            });
            
            // Валидация
            if (!nameInput.value.trim()) {
                isValid = false;
                errorMessage += '• Введите имя.<br>';
                nameInput.style.borderBottomColor = 'var(--color-error, #ff6b6b)';
            }
            
            if (!emailInput.value.trim()) {
                isValid = false;
                errorMessage += '• Введите email.<br>';
                emailInput.style.borderBottomColor = 'var(--color-error, #ff6b6b)';
            } else if (!isValidEmail(emailInput.value)) {
                isValid = false;
                errorMessage += '• Некорректный email.<br>';
                emailInput.style.borderBottomColor = 'var(--color-error, #ff6b6b)';
            }
            
            if (!messageInput.value.trim()) {
                isValid = false;
                errorMessage += '• Введите сообщение.<br>';
                messageInput.style.borderBottomColor = 'var(--color-error, #ff6b6b)';
            }
            
            // Вывод результата в блок, а не в alert
            if (feedbackBlock) {
                if (isValid) {
                    feedbackBlock.className = 'form-feedback success';
                    feedbackBlock.innerHTML = '✨ Спасибо за заявку! Мы свяжемся с вами в ближайшее время.';
                    this.reset();
                    
                    // Автоскрытие сообщения через 5 секунд
                    setTimeout(() => {
                        feedbackBlock.innerHTML = '';
                        feedbackBlock.className = 'form-feedback';
                    }, 5000);
                } else {
                    feedbackBlock.className = 'form-feedback error';
                    feedbackBlock.innerHTML = `Пожалуйста, исправьте ошибки:<br>${errorMessage}`;
                }
            } else {
                // Фолбэк на alert, если блок не найден
                if (isValid) alert('Спасибо за заявку!');
                else alert(errorMessage.replace(/<br>/g, '\n'));
            }
        });
    }
    
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Сброс стилей при вводе
    const formInputs = document.querySelectorAll('.input-field, .textarea-field');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.style.borderBottomColor = '#fff';
            if (feedbackBlock) {
                feedbackBlock.innerHTML = '';
                feedbackBlock.className = 'form-feedback';
            }
        });
    });

    // ========== РАСКРЫВАЮЩИЙСЯ БЛОК "УЗНАТЬ БОЛЬШЕ" ==========
    const learnMoreBtn = document.getElementById('learnMoreBtn');
    const travelDetails = document.getElementById('travelDetails');
    
    if (learnMoreBtn && travelDetails) {
        learnMoreBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (travelDetails.style.display === 'none') {
                travelDetails.style.display = 'block';
                learnMoreBtn.textContent = 'Скрыть';
                
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header').offsetHeight;
                    const targetPosition = travelDetails.offsetTop - headerHeight - 20;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            } else {
                travelDetails.style.display = 'none';
                learnMoreBtn.textContent = 'Узнать больше';
            }
        });
    }
    
    // ========== КНОПКА "НАВЕРХ" С ПРОГРЕССОМ ==========
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const progressCircle = document.querySelector('.scroll-to-top__progress-circle');
    
    if (scrollToTopBtn) {
        function updateProgress() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            
            if (progressCircle) {
                const circumference = 2 * Math.PI * 28;
                const offset = circumference - (scrollPercent / 100) * circumference;
                progressCircle.style.strokeDashoffset = offset;
            }
            
            if (scrollTop > 500) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        }
        
        window.addEventListener('scroll', updateProgress);
        window.addEventListener('resize', updateProgress);
        
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        updateProgress();
    }
    
}); // Конец DOMContentLoaded
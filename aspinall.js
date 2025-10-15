
const navToggle = document.querySelector('.nav-toggle');
const headerNav = document.querySelector('.header__nav');
const navLinks = document.querySelectorAll('.nav__link');
const sections = document.querySelectorAll('section');
const filterBtns = document.querySelectorAll('.filter-btn');
const menuItemsContainer = document.querySelector('.menu__items');
const reservationForm = document.querySelector('.reservation__form');


const menuItems = [
    {
        id: 1,
        name: 'Хумус',
        price: 350,
        description: 'Нутовое пюре с тахини, оливковым маслом и специями',
        category: 'meze',
        image: 'slivki.png'
    },
    {
        id: 2,
        name: 'Долма',
        price: 420,
        description: 'Виноградные листья, фаршированные рисом и мясом',
        category: 'meze',
        image: 'dolma.png'
    },
    {
        id: 3,
        name: 'Кебаб',
        price: 580,
        description: 'Мясо на гриле с овощами и специями',
        category: 'grill',
        image: 'kebab.png'
    },
    {
        id: 4,
        name: 'Лахмаджун',
        price: 320,
        description: 'Тонкая лепешка с мясным фаршем и овощами',
        category: 'grill',
        image: 'lahma.png'
    },
    {
        id: 5,
        name: 'Баклава',
        price: 280,
        description: 'Слоеное тесто с орехами и сиропом',
        category: 'dessert',
        image: 'pirog.png'
    },
    {
        id: 6,
        name: 'Кюнефе',
        price: 350,
        description: 'Сырный десерт с сиропом и фисташками',
        category: 'dessert',
        image: 'decert.png'
    },
    {
        id: 7,
        name: 'Айран',
        price: 150,
        description: 'Освежающий йогуртовый напиток',
        category: 'drink',
        image: 'airan.png'
    },
    {
        id: 8,
        name: 'Турецкий чай',
        price: 100,
        description: 'Ароматный черный чай по-турецки',
        category: 'drink',
        image: 'cay.png'
    }
];


document.addEventListener('DOMContentLoaded', function() {
    
    renderMenuItems(menuItems);
    
   
    initMenuFilters();
    
    
    initNavigation();
    
    
    initReservationForm();
});


function renderMenuItems(items) {
    menuItemsContainer.innerHTML = '';
    
    if (items.length === 0) {
        menuItemsContainer.innerHTML = '<p class="no-items">Блюда не найдены</p>';
        return;
    }
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-item ${item.category}`;
        menuItem.setAttribute('data-category', item.category);
        
        menuItem.innerHTML = `
            <div class="menu-item__image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="menu-item__content">
                <div class="menu-item__title">
                    <span>${item.name}</span>
                    <span class="menu-item__price">${item.price} ₽</span>
                </div>
                <p class="menu-item__description">${item.description}</p>
                <span class="menu-item__category">${getCategoryName(item.category)}</span>
            </div>
        `;
        
        menuItemsContainer.appendChild(menuItem);
    });
}


function getCategoryName(category) {
    const categoryNames = {
        'meze': 'Мезе',
        'grill': 'Гриль',
        'dessert': 'Десерт',
        'drink': 'Напиток'
    };
    
    return categoryNames[category] || category;
}


function initMenuFilters() {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            
            filterBtns.forEach(b => b.classList.remove('active'));
            
            
            this.classList.add('active');
            
            
            const filter = this.getAttribute('data-filter');
            
            
            if (filter === 'all') {
                renderMenuItems(menuItems);
            } else {
                const filteredItems = menuItems.filter(item => item.category === filter);
                renderMenuItems(filteredItems);
            }
        });
    });
}


function initNavigation() {
    
    navToggle.addEventListener('click', function() {
        this.classList.toggle('active');
        headerNav.classList.toggle('active');
    });
    
    
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                navToggle.classList.remove('active');
                headerNav.classList.remove('active');
            }
        });
    });
    
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetEl = document.querySelector(targetId);
            
            if (targetEl) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetEl.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    window.addEventListener('scroll', highlightActiveLink);
}


function highlightActiveLink() {
    let current = '';
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
}


function initReservationForm() {
    if (!reservationForm) return;
    
    
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
    
    
    reservationForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        
        const formData = new FormData(this);
        const reservationData = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            date: formData.get('date'),
            time: formData.get('time'),
            guests: formData.get('guests'),
            message: formData.get('message')
        };
        
        
        if (validateReservationForm(reservationData)) {
           
            showReservationSuccess(reservationData);
            this.reset();
        }
    });
}


function validateReservationForm(data) {
    
    if (data.name.trim().length < 2) {
        alert('Пожалуйста, введите корректное имя');
        return false;
    }
    
    
    const phoneRegex = /^(\+7|7|8)?[\s\-]?\(?[489][0-9]{2}\)?[\s\-]?[0-9]{3}[\s\-]?[0-9]{2}[\s\-]?[0-9]{2}$/;
    if (!phoneRegex.test(data.phone.replace(/\s/g, ''))) {
        alert('Пожалуйста, введите корректный номер телефона');
        return false;
    }
    
    
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        alert('Нельзя забронировать столик на прошедшую дату');
        return false;
    }
    
    return true;
}


function showReservationSuccess(data) {
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            <h3>Бронирование подтверждено!</h3>
            <p>Спасибо, ${data.name}! Ваш столик забронирован на ${data.date} в ${data.time} для ${data.guests} ${getGuestWord(data.guests)}.</p>
            <p>Мы свяжемся с вами по номеру ${data.phone} для подтверждения.</p>
            <button class="btn btn--primary close-modal-btn">Отлично</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    
    const modalStyles = `
        <style>
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
                animation: fadeIn 0.3s;
            }
            
            .modal-content {
                background-color: white;
                padding: 40px;
                border-radius: 10px;
                max-width: 500px;
                width: 90%;
                text-align: center;
                position: relative;
                animation: slideIn 0.3s;
            }
            
            .close-modal {
                position: absolute;
                top: 15px;
                right: 15px;
                font-size: 1.5rem;
                cursor: pointer;
                color: #777;
            }
            
            .success-icon {
                font-size: 4rem;
                color: #4ecdc4;
                margin-bottom: 20px;
            }
            
            .modal-content h3 {
                margin-bottom: 15px;
                color: #333;
            }
            
            .modal-content p {
                margin-bottom: 15px;
                color: #555;
            }
            
            .close-modal-btn {
                margin-top: 20px;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        </style>
    `;
    
    document.head.insertAdjacentHTML('beforeend', modalStyles);
    
    
    const closeModal = () => {
        document.body.removeChild(modal);
       
        const addedStyle = document.head.querySelector('style:last-of-type');
        if (addedStyle) document.head.removeChild(addedStyle);
    };
    
    modal.querySelector('.close-modal').addEventListener('click', closeModal);
    modal.querySelector('.close-modal-btn').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}


function getGuestWord(count) {
    if (count === '1') return 'гостя';
    if (count === '2' || count === '3' || count === '4') return 'гостей';
    return 'гостей';
}
const hoverElement = document.getElementById('header__name');

hoverElement.addEventListener('mouseenter', function() {
    hoverElement.style.color = 'lightgreen';
});

hoverElement.addEventListener('mouseleave', function() {
    hoverElement.style.color = 'lightblue';
});

const fadeText = document.getElementById('fadeText');
fadeText.addEventListener('mouseenter', function() {
    fadeText.style.opacity = '1';
});
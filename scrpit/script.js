document.addEventListener('DOMContentLoaded', () => {
    'use strict'

    const customer = document.getElementById('customer');
    const freelancer = document.getElementById('freelancer');
    const blockCustomer = document.getElementById('block-customer');
    const blockFreelance = document.getElementById('block-freelancer');
    const blockChoice = document.getElementById('block-choice');
    const btnExit = document.getElementById('btn-exit');
    const formCustomer = document.getElementById('form-customer');
    const ordersTable = document.getElementById('orders');
    const modalOrder = document.getElementById('order_read');
    const modalOrderActive = document.getElementById('order_active'); 
    const orders = JSON.parse(localStorage.getItem('freeOrders')) || [];

    const toStorage = () => {
        localStorage.setItem('freeOrders', JSON.stringify(orders));
    };

    const declOfNum = (number, titles) => number + ' ' + titles[(number % 100 > 4 && number % 100 < 20) ?
         2 : [2, 0, 1, 1, 1, 2][(number % 10 < 5) ? number % 10 : 5]];

    const calcDeadline = (data) => {
        const deadline = new Date(data);
        const toDay = Date.now();
        
        const remaining = (deadline - toDay) / 1000 / 60 / 60;

        if(remaining / 24 > 2){
        return declOfNum(Math.floor(remaining), ['день', 'дня', 'дней']);
    }
    return  declOfNum(Math.floor(remaining), ['час', 'часа', 'часов'])


}

    const renderOrders = () => {

        ordersTable.textContent = '';

        orders.forEach((order, i) => {     
            ordersTable.innerHTML += `
            <tr class="order ${order.active ? 'taken' : ''}" data-number-order="${i}">
				<td>${i+1}</td>
				<td>${order.title}</td>
				<td class="${order.currency}"></td>
				<td>${calcDeadline(order.deadline)}</td>
            </tr>`;
        });
    };

    const handlerModal = (event) => {
        const target = event.target;
        const modal = target.closest('.order-modal');
        const order = orders[modal.id];

        const baseAction = () => {
            modal.style.display = 'none';
            toStorage();
            renderOrders();
        }

        if(target.closest('.close') || target === modal){
            modal.style.display = 'none';
        }

        if(target.classList.contains('get-order')){
            order.active = true;
            baseAction();
        }

        if(target.id === 'capitulation'){
            order.active = false;
            baseAction();
        }
        
        if(target.id === 'ready'){
            orders.splice(orders.indexOf(order), 1);
            baseAction();
        }
    }

    const openModal = (numberOrder) => {
        const order = orders[numberOrder];

        const { title, firstName, email, phone, description, amount, currency, deadline, active = false } = order;

        const modal = order.active ? modalOrderActive : modalOrder;

        const firstNameBlock = modal.querySelector('.firstName');
        const titleBlock = modal.querySelector('.modal-title');
        const emailBlock = modal.querySelector('.email');
        const descriptionBlock = modal.querySelector('.description');
        const deadlineBlock = modal.querySelector('.deadline');
        const currencyBlock = modal.querySelector('.currency_img');
        const countBlock = modal.querySelector('.count');
        const phoneBlock = modal.querySelector('.phone');

        modal.id = numberOrder;
        titleBlock.textContent = title;
        firstNameBlock.textContent = firstName;
        emailBlock.textContent = email;
        emailBlock.href = 'mailto:' + email;
        descriptionBlock.textContent = description;
        deadlineBlock.textContent = calcDeadline(deadline);
        currencyBlock.className = 'currency_img';
        currencyBlock.classList.add(currency);
        countBlock.textContent = amount;
        phoneBlock && (phoneBlock.href = 'tel:' + phone);
        modal.style.display = 'flex';
        modal.addEventListener('click', handlerModal)
    };

    ordersTable.addEventListener('click', (event) => {
        const target = event.target;
        const targetOrder = target.closest('.order')
        if(targetOrder){
            openModal(targetOrder.dataset.numberOrder);
        }
    });

    customer.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        const toDay = new Date().toISOString().substring(0, 10);
        document.getElementById('deadline').min = toDay;
        formCustomer.getElementsBy
        blockCustomer.style.display = 'block';
        btnExit.style.display = 'block';
    });

    freelancer.addEventListener('click', () => {
        blockChoice.style.display = 'none';
        renderOrders();
        blockFreelance.style.display = 'block';
        btnExit.style.display = 'block';
    });

    btnExit.addEventListener('click', () => {
        btnExit.style.display = 'none';
        blockFreelance.style.display = 'none';
        blockCustomer.style.display = 'none';
        blockChoice.style.display = 'block';
    });

    formCustomer.addEventListener('submit', (event) => {
        event.preventDefault();
        const obj = {};
        const elements = [...formCustomer.elements]
                      .filter((elem) => (elem.tagName === 'INPUT' && elem.type !== 'radio') 
                                     || (elem.type === 'radio' && elem.checked) 
                                     ||  elem.tagName === 'TEXTAREA');
            elements.forEach((elem) => {
                obj[elem.name] = elem.value;
                    })
        formCustomer.reset();
        orders.push(obj);
    });
})
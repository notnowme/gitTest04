window.onload = () => {
  const log = console.log;
  const body = document.body;

  let scrollY = window.scrollY;
  let innerHeight = window.innerHeight;
  let innerWidth = window.innerWidth;
  let currentSection = 0;
  let scrollHeight = document.body.scrollHeight;

  // elem
  const header = document.querySelector('#header');

  // gnb
  const gnb = document.querySelector('#gnb');

  gnb.addEventListener('click', (e) => {
    let target = e.target;

    if (target.tagName === 'A') {
      e.preventDefault();

      let moveTo = target.getAttribute('href');
      let moveTarget = document.querySelector(`${moveTo}`).offsetTop;
      window.scrollTo({top: moveTarget, behavior: 'smooth'});
    }
  });

  const themeBtn = document.querySelector('.theme-btn');

  themeBtn.addEventListener('click', (e) => {
    e.preventDefault();
    body.classList.toggle('light');

    if (body.getAttribute('class') === 'light') {
      themeBtn.innerHTML = '<i class="icon-moon-inv"></i>';
    } else {
      themeBtn.innerHTML = '<i class="icon-sun-inv"></i>';
    }
  });

  // section
  const sections = document.querySelectorAll('.section');
  const sectionRange = [];

  const setLayout = () => {
    sections.forEach(section => {
      sectionRange.push([section.offsetTop, section.offsetTop + section.offsetHeight - 1]);
    });

    (scrollY > 0) ? header.classList.add('active') : header.classList.remove('active');
  };

  const cardBtnGroup = document.querySelector('.card-btn-group');

  cardBtnGroup.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      for (let i = 0; i < cardBtnGroup.children.length; i++) {
        cardBtnGroup.children[i].classList.remove('active');
      }
      e.target.classList.add('active');
    }
  });

  // tab
  const tabBtnGroup = document.querySelector('.tab-btn-group');
  const tabMenuGroup = document.querySelector('.tab');

  tabBtnGroup.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
      for (let i = 0; i < tabBtnGroup.children.length; i++) {
        tabBtnGroup.children[i].classList.remove('active');
        tabMenuGroup.children[i].classList.remove('active');
      }
      e.target.classList.add('active');

      let targetNum = e.target.dataset.num;

      tabMenuGroup.children[targetNum].classList.add('active');
    }
  });

  // top btn
  const topBtn = document.querySelector('.top-btn');

  topBtn.addEventListener('click', (e) => {
    e.preventDefault();

    window.scrollTo({top: 0, behavior: 'smooth'});
  });

  // cursor
  const btns = document.querySelectorAll('button');
  const links = document.querySelectorAll('a');
  const cursor = document.querySelector('.cursor');

  const detectCursor = (elem, className) => {
    elem.forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        cursor.classList.add(className);
      });
      elem.addEventListener('mouseleave', () => {
        cursor.classList.remove(className);
      });
    });
  };

  detectCursor(btns, 'cursor-btn');
  detectCursor(links, 'cursor-link');

  // mousemove
  window.addEventListener('mousemove', (e) => {
    let cursorX = e.clientX;
    let cursorY = e.clientY;
    let cursorHalf = cursor.offsetWidth / 2;

    cursor.style.transform = `translate(${cursorX - cursorHalf}px, ${cursorY - cursorHalf}px)`;
  });

  // scroll
  let scrollRatio = 0;
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;

    (0 < scrollY) ? header.classList.add('active') : header.classList.remove('active');
    (innerHeight < scrollY) ? topBtn.classList.add('active') : topBtn.classList.remove('active');
    
    scrollRatio = Math.round(scrollY / (scrollHeight - innerHeight) * 100);
  });

  // resize
  window.addEventListener('resize', () => {
    innerHeight = window.innerHeight;
    innerWidth = window.innerWidth;

    setLayout();
  });

  // init
  setLayout();
};
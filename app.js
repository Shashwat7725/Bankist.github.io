'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');
const nav = document.querySelector('nav');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabContent = document.querySelectorAll('.operations__content');

const openModal = function (e) {
    e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener("click",openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});


btnScrollTo.addEventListener("click",function (e){

    const s1coords = section1.getBoundingClientRect(); //it gets all the coordinates relative to viewing port.
    // console.log(s1coords);
    // console.log(e.target.getBoundingClientRect());

    //current scroll position from x and y.
    console.log('Current Scroll Position (X|Y)',window.pageXOffset,window.pageYOffset);

    console.log("height/width of viewport ",document.documentElement.clientHeight,document.documentElement.clientWidth);

    //Scrolling
    // window.scrollTo(s1coords.left + window.pageXOffset,s1coords.top + window.pageYOffset); // it gives distance of top that very edge of the browser you are currently in.


    //for smooth scrolling 
    // window.scrollTo({
    //     left: s1coords.left + window.pageXOffset,
    //     top: s1coords.top + window.pageYOffset,
    //     behavior: 'smooth'
    // })

    //modern way
    section1.scrollIntoView({ behavior: 'smooth'});

})


//Page Navigation

// document.querySelectorAll('.nav__link').forEach(function(el){
//     el.addEventListener("click",function (e){
//         e.preventDefault();
//         const id = this.getAttribute("href");
//         // console.log(id);
//         document.querySelector(id).scrollIntoView({behavior: 'smooth'});
//     })
// })
//this method is not efficient as function is called for each element. solution is event delegation


//1.Add event listener to common parent element
//2.Determine what element originated that event

document.querySelector('.nav__links').addEventListener("click",function(e){
    e.preventDefault();

    if(e.target.classList.contains('nav__link'))
    {
        const id = e.target.getAttribute('href');
        // console.log(id);
        document.querySelector(id).scrollIntoView({behavior: 'smooth'});
    }
});

//Tabbed components

tabsContainer.addEventListener('click',function(e){
    const clicked = e.target.closest('.operations__tab');
    console.log(clicked);
    //guard clause
    if(!clicked)
        return;

    //active tab
    tabs.forEach(t => t.classList.remove('operations__tab--active'));
    clicked.classList.add('operations__tab--active');

    //active content area
    tabContent.forEach(tc => tc.classList.remove('operations__content--active'));

    document.querySelector(`.operations__content--${clicked.dataset.tab}`).classList.add('operations__content--active')
});

//Menu Fade animation

const mouseHandle = function(e) {
    if(e.target.classList.contains('nav__link')){
        const link = e.target;
        const siblings = link.closest('.nav').querySelectorAll('.nav__link');
        const logo = link.closest('.nav').querySelector('img');

        siblings.forEach(el => {
            if(el !==link)
                el.style.opacity = this; //make it blur
            
        });
        logo.style.opacity = this;
    }
}

nav.addEventListener('mouseover',mouseHandle.bind(0.5));

nav.addEventListener('mouseout',mouseHandle.bind(1));

//Sticky navigation
// const initialCoords = section1.getBoundingClientRect();

// console.log(initialCoords);
// window.addEventListener('scroll',function (){
//     if(window.scrollY>initialCoords.top)
//     {
//         nav.classList.add('sticky');
//     }
//     else
//         nav.classList.remove('sticky');
// })



//sticky navigation using intersection observer API

// const obsCallback = function(entries, observer) {
//     entries.forEach(entry => {
//         console.log(entry);
//     })
// }
// //whenever the target = 'section1' intersects the viewport at 10% obsCallback will be called.
// const obsOptions = {
//     root: null, //indicates target element intersecting entire viewport.
//     threshold: [0, 0.2]  //it is the percentage of intersection at which the observer callback will be called
// }
// const observer = new IntersectionObserver(obsCallback,obsOptions)
// observer.observe(section1)

const header = document.querySelector('.header');
const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function(entries) {
    const [entry] =  entries;
    // console.log(entry);
    if(!entry.isIntersecting){
        nav.classList.add('sticky');
    }
    else
        nav.classList.remove('sticky')
}
const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0, //it means if 0% of header is available we want to trigger callback function.
    rootMargin: `-${navHeight}px`,  //bcz of root margin the nav appears 90px before the threshold is reached. 90px = height of nav.

});

headerObserver.observe(header);


//reveal sections
const allSections = document.querySelectorAll('.section');

const revealSection = function(entries, observer){
    const [entry] = entries;

    if(!entry.isIntersecting) return;

    entry.target.classList.remove('section--hidden')
    observer.unobserve(entry.target); //it unobserves all the elements so that it becomes more efficient.
}

const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15
});
allSections.forEach(section => {
    sectionObserver.observe(section);
    // section.classList.add('section--hidden') 
})


// ////////////////Lazy loading images

const imgTargets = document.querySelectorAll('img[data-src]');

const loadImg = function(entries, observer){
    const [entry] = entries;
    // console.log(entry);
    if(!entry.isIntersecting) return;

    //replace src with data-src
    entry.target.src = entry.target.dataset.src;

    entry.target.addEventListener('load',function(){
        entry.target.classList.remove('lazy-img')
    })
    observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg,{
    root: null,
    threshold: 0,
    rootMargin: '200px'
});

imgTargets.forEach(img => imgObserver.observe(img))

//Slider component
const slider = function() {
    const slides = document.querySelectorAll('.slide');
    const btnLeft = document.querySelector('.slider__btn--left');
    const btnRight = document.querySelector('.slider__btn--right');
    const dotContainer = document.querySelector('.dots');

    let curSlide=0;
    const maxSlide=slides.length;

    // const slider = document.querySelector('.slider');
    // slider.style.transform = 'scale(0.4) translateX(-800px)'
    // slider.style.overflow = 'visible'

    const createDots = function() {
        slides.forEach(function(_,i){
            dotContainer.insertAdjacentHTML("beforeend",`<button class="dots__dot" data-slide="${i}"</button>`)
        })
    }



    const activateDot = function(slide) {
        document.querySelectorAll('.dots__dot').forEach(dot => dot.classList.remove('dots__dot--active'));

        document.querySelector(`.dots__dot[data-slide="${slide}"]`).classList.add('dots__dot--active');
    }


    const goToSlide = function(slide){
        slides.forEach((s,i) => (s.style.transform = `translateX(${100 * (i-slide)}%)`));
    }

    const nextSlide = function(){
        if(curSlide === maxSlide-1){
            curSlide=0;
        }
        else
            curSlide++;

        goToSlide(curSlide);
        activateDot(curSlide);
    }

    const prevSlide = function(){
        if(curSlide===0)
            curSlide=maxSlide-1;
        else
            curSlide--;
        goToSlide(curSlide);
        activateDot(curSlide);
    }

    const init = function() {
        goToSlide(0);
        createDots();
        activateDot(0);
    }
    init()

    btnRight.addEventListener("click",nextSlide);
    btnLeft.addEventListener("click",prevSlide);

    document.addEventListener('keydown',function(e){
        if(e.key === 'ArrowRight')
            nextSlide();
        else if(e.key === 'ArrowLeft')
            prevSlide();
    })

    dotContainer.addEventListener("click",function (e) {
        if(e.target.classList.contains('dots__dot')){
            const { slide }= e.target.dataset;
            goToSlide(slide);
            activateDot(slide);
        }
    })

}
slider();



///////////////////  SELECTING ELEMENTS

// console.log(document.documentElement);  //apply styles to entire webpage
// // console.log(document.head);  
// // console.log(document.body);

// const header = document.querySelector('.header'); //gives first element that matches
// const allSections=document.querySelectorAll('.section');

// // console.log(allSections);
// document.getElementById("section--1");
// const allBtns = document.getElementsByTagName("button");
// // console.log(allBtns); // it updates automatically if any changes are done on the DOM.
// //as it gives HTMLCollection() instead of NodeList().

// console.log(document.getElementsByClassName("btn"));

// ///////////////////// CREATING AND INSERTING ELEMENTS
// //.insertAdjacentHTML

// const message = document.createElement('div');
// message.classList.add('cookie-message');

// message.innerHTML = 'We use cookies for better functionality and analytics. <button class="btn btn--close--cookie">Got it!</button>';

// header.prepend(message);
// //prepending adds the element as the first child of the header element in this case

// header.append(message); //it is live element in dom that is why it can not be on multiple places at the same time. So either prepend or append.

// //if you have to create multiple copies
// // header.append(message.cloneNode(true));
// //'true' means all the child elements will also be copied.

// // header.before(message)
// header.after(message)

// /////////////// DELETE ELEMENTS

// document.querySelector('.btn--close--cookie').addEventListener("click",function(){
//     message.remove();
// });

// ////////////// STYLES
// message.style.backgroundColor = '#37383d';
// message.style.width = '120%';

// // console.log(message.style.backgroundColor);
// // console.log(message.style.width);
// // console.log(message.style.height); //displays only already set values.

// //getComputedStyle() to get all the values in a webpage.

// console.log(getComputedStyle(message).color);
// message.style.height = Number.parseFloat( getComputedStyle(message).height,10) + 30 + 'px';

// document.documentElement.style.setProperty('--color-primary','orangered');


// ////////////ATTRIBUTES
// const logo = document.querySelector('.nav__logo');
// // console.log(logo.alt);
// // console.log(logo.src);

// ////////////Data attributes
// // console.log(logo.dataset.versionNumber);

// // ////Classes
// // logo.classList.add('c','j');
// // logo.classList.remove('c','j');
// // logo.classList.toggle('c');
// // logo.classList.contains('c');



// //event 
// // const h1 = document.querySelector('h1');

// // //allows to add multiple event listeners to the same event
// // const alertH1 = function(e) {
// //     alert('hello world');
// // }
// // h1.addEventListener("mouseenter",alertH1);

// // setTimeout(() => h1.removeEventListener('mouseenter',alertH1),3000);

// //rgb(255,255,255)

// const randInt = (max,min) => Math.floor(Math.random()*(max-min+1)+min);



// const randColor = () => `rgb(${randInt(255,0)},${randInt(255,0)},${randInt(255,0)})`;

// console.log(randColor());

// document.querySelector(".nav__link").addEventListener("click",function (e){
//     this.style.backgroundColor = randColor();
//     console.log("link",e.target, e.currentTarget);
    
//     //stop propagation - it stops propagation upto the parent element
//     // e.stopPropagation();
// })

// document.querySelector(".nav__links").addEventListener("click",function (e){
//     this.style.backgroundColor = randColor();
//     console.log("nav-link",e.target,e.currentTarget);   //e.target is same as the event 'e' here bubbles upto the parent in the dom structure.
// })

// document.querySelector(".nav").addEventListener("click",function (e){
//     this.style.backgroundColor = randColor();
//     console.log("nav",e.target,e.currentTarget);
// })

// //this shows that event bubbles only upto the parent element they have.

//Dom traversing

// const h1 = document.querySelector('h1');

// //going downwards:child

// console.log(h1.querySelectorAll('.highlight'));
// console.log(h1.childNodes);
// console.log(h1.children);
// h1.firstElementChild.style.color = 'white';
// h1.lastElementChild.style.color = 'blue';

// //going upwards:parents

// console.log(h1.parentNode);

// h1.closest('.header').style.background = 'var(--gradient-secondary)';

// //it choosed the closest header to h1 element 
// //closest is opposite to querySelector in a way that it chooses parentElement in the DOM tree while querySelector chooses childElement in DOM tree.

// //going sideways
// console.log(h1.previousElementSibling);
// console.log(h1.nextElementSibling);
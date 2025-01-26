const slides = document.querySelectorAll(".slide");
const slideOne = document.getElementById("slideOne");
const slideTwo = document.getElementById("slideTwo");
const slideThree = document.getElementById("slideThree");
const slideFour = document.getElementById("slideFour");
const slideFive = document.getElementById("slideFive");
const dots = document.querySelectorAll(".dot");

const iPhone = document.getElementById("scrollToIphones");
const AirPod = document.getElementById("scrollToAirPods");
const iTunes = document.getElementById("scrollToGiftCards");
const Charger = document.getElementById("scrollToAccessories");
const hamburger = document.getElementById("hamburger");
const navbar = document.getElementById("navbar");

async function displayProductCard() {
    try {
      const productCards = document.querySelectorAll('.product-card');  // Get all product cards
  
      // Iterate over each card
      for (let card of productCards) {
        const productId = card.getAttribute('data-id');  // Get unique ID from data-id
        const productName = card.querySelector('.product-name');  // Get product name element
        const productPrice = card.querySelector('.product-price');  // Get product price element
        const mainImage = card.querySelector('.main-image');  // Get main image element
        const Save = card.querySelector('.save-tag');
  
        // Fetch product data by productId (you can change the productId dynamically for each card)
        const response = await fetch(`/api/products/${productId}`);
        const product = await response.json();
  
        // Update product details dynamically
        productName.textContent = product.name;
        Save.textContent = `SAVE: ${product.saveTag}%`;
        productPrice.textContent = `Price: ৳${product.price}`;
        mainImage.src = product.image[Math.ceil(Math.random()*2)] || '/images/placeholder.jpg' // Set main image or default image
        
      }
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
}  
displayProductCard();
  

iPhone.addEventListener("click", () => {
    navbar.classList.toggle("active");
});
AirPod.addEventListener("click", () => {
    navbar.classList.toggle("active");
});
iTunes.addEventListener("click", () => {
    navbar.classList.toggle("active");
});
Charger.addEventListener("click", () => {
    navbar.classList.toggle("active");
});

dots.forEach(dot => {
    dot.addEventListener("click", () => {
        clearInterval(myInterval);
    });
});

slides.forEach((element, index)=>{
    element.style.left = `${index * 100}%`;
})

const funcList = [one, two, three, four, five]
let currentFunc = 1;

function callFunctions() {
    funcList[currentFunc]();
    currentFunc = (currentFunc + 1) % funcList.length;
}

let myInterval = setInterval(callFunctions, 5000);

function one(){
    slideOne.style.left = "0%";
    slideTwo.style.left = "100%";
    slideThree.style.left = "200%";
    slideFour.style.left = "300%";
    slideFive.style.left = "400%";
}
function two(){
    slideOne.style.left = "-100%";
    slideTwo.style.left = "0%";
    slideThree.style.left = "100%";
    slideFour.style.left = "200%";
    slideFive.style.left = "300%";
}
function three(){
    slideOne.style.left = "-200%";
    slideTwo.style.left = "-100%";
    slideThree.style.left = "0%";
    slideFour.style.left = "100%";
    slideFive.style.left = "200%";
}
function four(){
    slideOne.style.left = "-300%";
    slideTwo.style.left = "-200%";
    slideThree.style.left = "-100%";
    slideFour.style.left = "0%";
    slideFive.style.left = "100%";
}
function five(){
    slideOne.style.left = "-400%";
    slideTwo.style.left = "-300%";
    slideThree.style.left = "-200%";
    slideFour.style.left = "-100%";
    slideFive.style.left = "0%";
}

// Scroll to iPun

document.getElementById("scrollToIphones").addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("iPhones");
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});
slideOne.addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("iPhones");
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});

// Scroll to airPud

document.getElementById("scrollToAirPods").addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("AirPods");
    
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});
slideTwo.addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("AirPods");
    
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});

// Scroll to Charger

document.getElementById("scrollToAccessories").addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("Accessories");
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});
slideFour.addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("Accessories");
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});
slideFive.addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("Accessories");
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});

// iTunes Cards

document.getElementById("scrollToGiftCards").addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("GiftCards");
    
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});
slideThree.addEventListener("click", function(event) {
    event.preventDefault();
    const targetSection = document.getElementById("GiftCards");
    
    const navbarHeight = document.querySelector("header").offsetHeight;
    const elementPosition = targetSection.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

    window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
    });
});

// Hamburgerr

hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navbar.classList.toggle("active");
});



























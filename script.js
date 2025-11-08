// Background slideshow
const images = document.querySelectorAll(".backgrounds img");
let current = 0;
function showImage(idx){
  images.forEach((img,i)=>img.classList.toggle("active", i===idx));
}
setInterval(()=>{
  current = (current+1) % images.length;
  showImage(current);
},5000);

// Toggle mobile menu
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("show");
});

// See More Projects button
const seeMoreBtn = document.getElementById("see-more");
if(seeMoreBtn){
  seeMoreBtn.addEventListener("click", () => {
    document.querySelectorAll(".extra-project").forEach(p => p.style.display="block");
    seeMoreBtn.style.display="none";
  });
}

// Fake contact form submit
function fakeSubmit(e){
  e.preventDefault();
  const msg = document.getElementById("form-msg");
  msg.textContent = "✅ Message sent successfully! (Simulation)";
  e.target.reset();
  return false;
}

// Background slideshow
const images = document.querySelectorAll(".backgrounds img");
let current = 0;
function showImage(idx){
  images.forEach((img,i)=>img.classList.toggle("active",i===idx));
}
setInterval(()=>{
  current=(current+1)%images.length;
  showImage(current);
},5000);

// See More Projects button
const seeMoreBtn = document.getElementById("see-more");
seeMoreBtn.addEventListener("click",()=>{
  document.querySelectorAll(".extra-project").forEach(p=>p.style.display="block");
  seeMoreBtn.style.display="none";
});

// Simulated contact form
function fakeSubmit(e){
  e.preventDefault();
  const msg=document.getElementById("form-msg");
  msg.textContent="Message sent successfully! (Simulation)";
  e.target.reset();
  return false;
}

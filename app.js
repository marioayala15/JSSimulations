const navSlide=() =>{

    const burger = document.querySelector(".burger");
    const nav = document.querySelector(".nav-links");
    const navLinks =document.querySelectorAll(".nav-links li");
    const leftfooter = document.querySelector(".left_footer");
    const rightfooter = document.querySelector(".right_footer");
    

    burger.addEventListener('click',() => {
        nav.classList.toggle('nav-active');
        leftfooter.classList.toggle('footer-nav-active');
        rightfooter.classList.toggle('footer-nav-active');
        

        navLinks.forEach((link, index) =>{
            if(link.style.animation){
             link.style.animation = '';
            } else {
             link.style.animation = `navLinkFade 0.5s ease forwards ${index/5+0.5}s`
            }
         });

        burger.classList.toggle("toggle");
    });

    
}

navSlide();
const controls = document.querySelectorAll(`.control`);
const slickDots = document.querySelectorAll('.slick-dot-item');
let currentItem = 0;
const items = document.querySelectorAll(".item");
const maxItems = items.length;
items.forEach(e=>{
  
  if(e.classList.contains('current-item')){
    document.querySelectorAll('.indice-title').forEach(e=>{
      e.innerHTML= items[currentItem].textContent;
    })
  };
  e.addEventListener('click',()=>{
    document.querySelectorAll('.indice-title').forEach(e=>{
      e.innerHTML= items[currentItem].textContent;
    })
  })
})
controls.forEach((control) => {
  control.addEventListener("click", () => {
    const isLeft = control.classList.contains("arrow-left");
    if (isLeft) {
      currentItem -= 1;
    } else {
      currentItem += 1;
    }

    if (currentItem >= maxItems) {
      currentItem = 0;
    }
    if (currentItem < 0) {
      currentItem = maxItems - 1;
    }

    items.forEach((item) => {
      item.classList.remove("current-item");
      items[currentItem].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block:'nearest'
      });
      document.querySelectorAll('.indice-title').forEach(e=>{
        e.innerHTML= items[currentItem].textContent;
      })
      items[currentItem].classList.add("current-item");
    });
  });
  
  let newItems = [];
  items.forEach((item) => {
    newItems.push(item);
    item.addEventListener("click", (e) => {
      newItems.filter((e, i) => {
        if (e != item) e.classList.remove("current-item");
        if (e == item) currentItem = i;
      });
      // currentItem = i;
      e.target.parentElement.classList.add("current-item");
    });
  });
});

slickDots.forEach((dots,i)=>{
  dots.parentElement.addEventListener('click',(e)=>{
    document.querySelectorAll('.indice-title').forEach(e=>{
      e.innerHTML= items[currentItem].textContent;
    })
    currentItem = i;
    console.log(e);
    e.target.classList.add('active');
    items.forEach((item) => {
      item.classList.remove("current-item");
      items[currentItem].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block:'nearest'
      });
      items[currentItem].classList.add("current-item");
    });
  }) 
});

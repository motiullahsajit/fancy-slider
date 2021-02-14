const imagesArea = document.querySelector('.images');
const gallery = document.querySelector('.gallery');
const galleryHeader = document.querySelector('.gallery-header');
const searchBtn = document.getElementById('search-btn');
const sliderBtn = document.getElementById('create-slider');
const sliderContainer = document.getElementById('sliders');
// selected image 
let sliders = [];
// api key
const key = '20265305-e80c7c18384a3112d54a1da8f';

// show images 
const showImages = (images) => {
  imagesArea.style.display = 'block';
  gallery.innerHTML = '';
  // show gallery title
  galleryHeader.style.display = 'flex';
  images.forEach(image => {
    let div = document.createElement('div');
    div.className = 'col-lg-3 col-md-4 col-xs-6 img-item mb-2';
    div.innerHTML = ` <img class="img-fluid img-thumbnail" onclick=selectItem(event,"${image.webformatURL}") src="${image.webformatURL}" alt="${image.tags}">`;
    gallery.appendChild(div)
  })
  loadingSpiner();
}

const getImages = (query) => {
  loadingSpiner();
  fetch(`https://pixabay.com/api/?key=${key}&q=${query}+flowers&image_type=photo&pretty=true`)
    .then(response => response.json())
    .then(data => {
      if (data.hits) {
        showImages(data.hits)
      }
      else {
        console.log('nothing found')
        getError(`<h1 class="text-center text-danger">Sorry No Result Found!!</h1>`)
      }
    })
    .catch(err => getError(`<h1 class="text-center text-danger">Sorry failed to load data!!</h1>`))
};

const getError = (errorText) => {
  const imgGallery = document.getElementById('img-gallery');
  imgGallery.innerHTML = errorText;
  loadingSpiner();
}

let slideIndex = 0;
const selectItem = (event, img) => {
  let element = event.target;
  element.classList.add('added');

  let item = sliders.indexOf(img);
  if (item === -1) {
    sliders.push(img);
  } else {
    delete sliders[item];
    element.classList.toggle('added');
  }
};

var timer
const createSlider = () => {
  // check slider image length
  if (sliders.length < 2) {
    alert('Select at least 2 images.')
    return;
  }

  let duration = document.getElementById('duration').value * 1000 || 2000;
  if (duration <= 0) {
    alert('Duration value cannot be negative, please enter a positive value');
  }
  else {
    // crate slider previous next area
    sliderContainer.innerHTML = '';
    const prevNext = document.createElement('div');
    prevNext.className = "prev-next d-flex w-100 justify-content-between align-items-center";
    prevNext.innerHTML = ` 
  <span class="prev" onclick="changeItem(-1)"><i class="fas fa-chevron-left"></i></span>
  <span class="next" onclick="changeItem(1)"><i class="fas fa-chevron-right"></i></span>
  `;

    sliderContainer.appendChild(prevNext)
    document.querySelector('.main').style.display = 'block';
    // hide image aria
    imagesArea.style.display = 'none';
    sliders.forEach(slide => {
      let item = document.createElement('div')
      item.className = "slider-item";
      item.innerHTML = `<img class="w-100"
        src="${slide}"
        alt="">`;
      sliderContainer.appendChild(item)
    })
    changeSlide(0)
    timer = setInterval(function () {
      slideIndex++;
      changeSlide(slideIndex);
    }, duration);

  }
};

// change slider index 
const changeItem = index => {
  changeSlide(slideIndex += index);
};

// change slide item
const changeSlide = (index) => {

  const items = document.querySelectorAll('.slider-item');
  if (index < 0) {
    slideIndex = items.length - 1
    index = slideIndex;
  };

  if (index >= items.length) {
    index = 0;
    slideIndex = 0;
  }

  items.forEach(item => {
    item.style.display = "none"
  })

  items[index].style.display = "block"
};

searchBtn.addEventListener('click', function () {
  document.querySelector('.main').style.display = 'none';
  clearInterval(timer);
  const search = document.getElementById('search');
  getImages(search.value)
  sliders.length = 0;
});

sliderBtn.addEventListener('click', function () {
  createSlider()
});

//enter button funtion
document.getElementById('search').addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    searchBtn.click();
  }
});
duration.addEventListener('keypress', function (event) {
  if (event.key == 'Enter') {
    sliderBtn.click();
  }
});

//loading spiner function
const loadingSpiner = () => {
  const spinner = document.getElementById('loading-spinner');
  const imgGallery = document.getElementById('img-gallery');
  spinner.classList.toggle('d-none');
  spinner.classList.toggle('d-flex');
  imgGallery.classList.toggle('d-none')
};

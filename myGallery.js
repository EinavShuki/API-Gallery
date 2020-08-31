const auth = "563492ad6f91700001000001ebc665ba6aed468dac325eaf8242f190";
const gallery = document.querySelector(".gallery"); //div
const searchInput = document.querySelector(".search-input"); //input
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch; //a sign to inform that we check for something

//eventLIsteners
searchInput.addEventListener("input", updateInput);
form.addEventListener("submit", (e) => {
  e.preventDefault(); //so the page won't be refreshes each time
  currentSearch = searchValue;
  searchPhotos(searchValue);
});
more.addEventListener("click", loadMore);

//after typing in text-input for search , searchValue is changhing
function updateInput(e) {
  //   console.log(e.target.value);
  searchValue = e.target.value;
}

//api function that brings the photo/s from pexels.com
async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    //get, post,update
    method: "GET",
    headers: {
      //what we want to accept
      Accept: "aplication/json", //cause we want a json file
      Authorization: auth,
    },
  });
  data = await dataFetch.json(); //parse the json file to an object we can work with
  return data;
}

//generating new div for aech new photo
function generatePhoto(data) {
  //   console.log(data);
  data.photos.forEach((photo) => {
    // console.log(photo);
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
    <div class="gallery-info">
        <p>${photo.photographer}</p>
        <a target="_blank" href=${photo.src.original}>Download</a>
        </div>
        <img src=${photo.src.large}></img>
        `;
    gallery.appendChild(galleryImg);
  });
}

// FETCHING THE IMAGES FROM pexels.com
async function curetadPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=16&page=1";
  //it is important to write "await" because that is the returned value
  const data = await fetchApi(
    fetchLink //eaech page has 16 photos
  );
  generatePhoto(data);
}

//Searching a specific photo
async function searchPhotos(search) {
  fetchLink = `https://api.pexels.com/v1/search?query=${search}+query&per_page=16&page=1`;
  clear();
  const data = await fetchApi(fetchLink);
  generatePhoto(data);
}
//When I am searching photo , all the other photos will disappear from page
function clear() {
  gallery.innerHTML = " ";
  searchInput.value = " "; //clear the input itself
}

//Clicking on "more" button
async function loadMore() {
  page++;
  //if searching  a photo ans press 'more'
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=16&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=16&page=${page}`;
  }
  const data = await fetchApi(fetchLink); //fetching api
  generatePhoto(data);
}

curetadPhotos();

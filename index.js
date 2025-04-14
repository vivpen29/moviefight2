const fetchData = async searchTerm => {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      s: searchTerm
    }
  });

  if (response.data.Error) {
    return [];
  }

  return response.data.Search;
};

createAutoComplete({
  root: document.querySelector(".left-autocomplete"),
  sideInd: "left"
});

createAutoComplete({
  root: document.querySelector(".right-autocomplete"),
  sideInd: "right"
});

let leftMovie;
let rightMovie;

async function onMovieSelection(movie, side) {
  const response = await axios.get('https://www.omdbapi.com/', {
    params: {
      apikey: 'd9835cc5',
      i: movie.imdbID
    }
  });

  if (side === "left") {
    document.querySelector(".left-movieDetailsContainer").innerHTML = movieTemplate(response.data);
    leftMovie = movie;
  } else {
    document.querySelector(".right-movieDetailsContainer").innerHTML = movieTemplate(response.data);
    rightMovie = movie;
  }

  if (leftMovie && rightMovie) {
    runComparison();
  }
}

let runComparison = () => {
  let leftSideStuff = document.querySelectorAll(".left-movieDetailsContainer .box .notification");
  let rightSideStuff = document.querySelectorAll(".right-movieDetailsContainer .box .notification");

  leftSideStuff.forEach((entry, index) => {
    const rightSideEntry = rightSideStuff[index];

    let leftSideVal = parseFloat(entry.dataset.value);
    let rightSideVal = parseFloat(rightSideEntry.dataset.value);

    if (isNaN(leftSideVal)) {
      leftSideVal = 0;
    }

    if ( isNaN(rightSideVal)) {
      rightSideVal = 0;
    }

    if (leftSideVal > rightSideVal) {
      entry.classList.remove('is-primary');
      entry.classList.add('is-warning');
      rightSideEntry.classList.remove('is-warning');
      rightSideEntry.classList.add('is-primary');
    } else if (leftSideVal === rightSideVal) {
      rightSideEntry.classList.remove('is-warning');
      entry.classList.remove('is-warning');
    } else {
      rightSideEntry.classList.remove('is-primary');
      rightSideEntry.classList.add('is-warning');
      entry.classList.remove('is-warning');
      entry.classList.add('is-primary');
    }
  })
};

const movieTemplate = (movieDetail) => {
  let boxoffice = parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
  let metascore = parseInt(movieDetail.Metascore);
  let imdbRating = parseFloat(movieDetail.imdbRating);
  let imdbVotes = parseInt(movieDetail.imdbVotes.replace(/,/g, ''));
  let awardsStringArray = movieDetail.Awards.split(' ');
  let awardSum = 0;
  for (let i of awardsStringArray) {
    if (parseInt(i)) {
      awardSum += parseInt(i);
    }
  }
  console.log(awardSum, boxoffice, metascore, imdbRating, imdbVotes);
  return `
    <div class="box">
        <article class="media">
             <div class="media-left">
                <p class="image">
                    <img src="${movieDetail.Poster}" alt="Image" />
                </p>
            </div>
            <div class="media-content">
                <div class="content">
                    <h1>${movieDetail.Title} (${movieDetail.Year})</h1> 
                    <h4>${movieDetail.Genre}</h4>
                    <p>${movieDetail.Plot}</p>
                </div>
            </div>
        </article>
        <article data-value="${awardSum}" class="notification is-primary">
            <h1>${movieDetail.Awards}</h1>
            <p>Awards</p>
        </article>
        <article data-value="${boxoffice}" class="notification is-primary">
            <h1>${movieDetail.BoxOffice}</h1>
            <p>Box Office</p>
        </article>
        <article data-value="${metascore}" class="notification is-primary">
            <h1>${movieDetail.Metascore}</h1>
            <p>Metascore</p>
        </article>
        <article data-value="${imdbRating}" class="notification is-primary">
            <h1>${movieDetail.imdbRating}</h1>
            <p>imdb Rating</p>
        </article>
        <article data-value="${imdbVotes}" class="notification is-primary">
            <h1>${movieDetail.imdbVotes}</h1>
            <p>imdb Votes</p>
        </article>
    </div>
  `;
}

const createAutoComplete = ({root, sideInd}) => {
    root.innerHTML =  `

  <label><b>Search for a Movie</b></label>
  <input class="input">
  <div class="dropdown">
    <div class="dropdown-menu">
        <div class="dropdown-content results"></div>      
    </div>
  </div>
                  `;
    const input = root.querySelector('input');
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results")

    const onInput = async event => {
        const movies = await fetchData(event.target.value);
        if (input.value==='') {
            dropdown.classList.remove("is-active");
            return;
        }
        resultsWrapper.innerHTML='';
        dropdown.classList.add("is-active");
        for (let movie of movies) {
            const anchorElement = document.createElement('a');
            anchorElement.setAttribute("class", "dropdown-item");
            anchorElement.innerHTML = `
      <img src="${movie.Poster}" />
      <h1>${movie.Title} (${movie.Year})</h1>
    `;
            anchorElement.addEventListener("click", async () => {
                input.value = movie.Title;
                dropdown.classList.remove("is-active");
                await onMovieSelection(movie, sideInd);
            })
            resultsWrapper.appendChild(anchorElement);
        }
    };

    input.addEventListener('input', debounce(onInput, 500));
    document.addEventListener("click", (event) => {
        if (!root.contains(event.target)) {
            dropdown.classList.remove("is-active");
        }
    })
}
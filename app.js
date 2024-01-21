let username = "johnpapa";
let page = 1;
let reposPerPage = 10; // default
let totalPublicRepos;

document.getElementById("loaderSection").style.display = "block"; // loader

document.addEventListener("DOMContentLoaded", () => {
  fetch(`https://api.github.com/users/${username}`)
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Not Found") {
        alert("Error");
        document.getElementById("loaderSection").style.display = "none"; //loader
      } else {
        displayProfile(data);
        totalPublicRepos = data.public_repos;
        fetchRepositories(data.public_repos, page, reposPerPage);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});

function displayProfile(data) {
  document.getElementById("profilePic").src = data.avatar_url;
  document.getElementById("profileName").textContent = data.name || data.login;
  document.getElementById("profileBio").textContent =
    data.bio || "No bio available.";
  document.getElementById("profileLink").href = data.html_url;
}

function fetchRepositories(totalPublicRepos, page, reposPerPage) {
  fetch(
    `https://api.github.com/users/${username}/repos?page=${page}&per_page=${reposPerPage}`
  )
    .then((response) => response.json())
    .then((reposData) => {
      displayRepositories(reposData);
      displayPagination(totalPublicRepos, reposPerPage);
    })
    .catch((error) => {
      console.error("Error fetching repositories:", error);
    });
}

function displayRepositories(repositories) {
  const repoContainer = document.getElementById("repositories");
  repoContainer.innerHTML = "";

  if (repositories.length === 0) {
    repoContainer.innerHTML = "<p>No repositories found.</p>";
    return;
  } else {
    repositories.forEach((repo) => {
      const languages = repo.languages_url;
      fetch(languages)
        .then((response) => response.json())
        .then((languageData) => {
          const usedLanguages = Object.keys(languageData);

          const card = `<div class="col-sm-6 mt-3">
                         <div class="card ">
                          <div class="card-body">
                          <h5 class="card-title">${repo.name}</h5>
                          <p class="card-text">
                          ${repo.description || "No description available"}
                          </p>
                          <p class="card-text">
                          ${usedLanguages.join(", ") || ""}
                          </p>
                          </div>
                         </div>
                       </div> `;
          repoContainer.innerHTML += card;
        })
        .catch((error) => console.error("Error fetching languages:", error));
    });
    document.getElementById("loaderSection").style.display = "none"; //loader
  }
}

function displayPagination(totalPublicRepos, reposPerPage) {
  const totalPages = Math.ceil(totalPublicRepos / reposPerPage);

  const pageList = document.getElementById("pagination");
  const prevBtn = document.createElement("li");
  prevBtn.innerText = "<<";
  prevBtn.classList.add("list-group-item", "page-link", "prevbtn");

  const nextBtn = document.createElement("li");
  nextBtn.innerText = ">>";
  nextBtn.classList.add("list-group-item", "page-link", "nextbtn");
  pageList.innerHTML = "";

  pageList.append(prevBtn);

  document.querySelector(".prevbtn").addEventListener("click", function () {
    document.getElementById("loaderSection").style.display = "block"; //loader
    console.log("click");
    page--;
    fetchRepositories(totalPublicRepos, page, reposPerPage);
  });

  for (let i = 1; i <= totalPages; i++) {
    const listItem = document.createElement("li");

    listItem.classList.add("list-group-item");
    listItem.classList.add("page-link");

    listItem.innerText = i;

    if (page === i) {
      listItem.classList.add("active");
    } else {
      listItem.classList.remove("active");
    }

    document.getElementById("paginationSection").style.display = "block";

    listItem.addEventListener("click", (e) => {
      document.getElementById("loaderSection").style.display = "block"; //loader
      page = parseInt(e.target.innerText, 10);
      console.log(page);
      fetchRepositories(totalPublicRepos, page, reposPerPage);
    });

    pageList.append(listItem);
  }

  pageList.append(nextBtn);

  document.querySelector(".nextbtn").addEventListener("click", function () {
    document.getElementById("loaderSection").style.display = "block"; //loader
    console.log("click");
    page++;
    fetchRepositories(totalPublicRepos, page, reposPerPage);
  });
}

document.getElementById("perPage").addEventListener("change", function () {
  document.getElementById("loaderSection").style.display = "block"; //loader
  reposPerPage = this.value;
  page = 1;
  fetchRepositories(totalPublicRepos, page, reposPerPage);
});

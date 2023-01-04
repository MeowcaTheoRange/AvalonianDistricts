var page = document.getElementById("page");
var search = document.getElementById("searchbar");
var overinput = document.querySelector(".overinput");
var clearinput = document.querySelector(".clearinput");
var searchNodes = [...document.getElementById("searchNodes").children];
var searchNodesCont = document.getElementById("searchNodes");
var sbheader = document.getElementById("sbheader");

search.addEventListener('input', onsearch);

function onsearch () {
  search.value = search.value.replace(/Redirects to /i, "|=> " );
  search.value = search.value.replace(/Redirects /i, "|=> ");
  if (sessionStorage.getItem("searchvalue") === "()" && search.value === ")")
    search.value = "";
  if (sessionStorage.getItem("searchvalue") === "()" && search.value === "(")
    search.value = "";
  if (search.value === "(" || search.value.startsWith("Tagged ")) {
    search.value = "()";
    search.setSelectionRange(1, 1);
    search.focus();
  }

  if (search.value != "") {
    searchNodesCont.classList.add("isSearching");
    sbheader.classList.add("isSearching");
  } else {
    searchNodesCont.classList.remove("isSearching");
    sbheader.classList.remove("isSearching");
    searchNodes.forEach(child => child.style.display = "")
  }

  var value = search.value.replace(/>/g, "&gt;").replace(/</g, "&lt;");
  if (search.value.startsWith("|=>")) {
    overinput.style.display = "inline-block";
    overinput.innerHTML = "Redirects " + (search.value.length > 4 && search.value !== "|=> " ? search.value.replace(/^\|\=\>/, "to ") : "");
    searchNodes.forEach(child => {
      child.style.display = "none";
      var name = child.querySelector(".linkname");
      if (name.innerHTML.toLowerCase().includes(value.toLowerCase()))
        child.style.display = "";
    });
  } else if (/^\(/.test(search.value) && /\)$/.test(search.value)) {
    overinput.style.display = "inline-block";
    overinput.innerHTML = "Tagged " + (search.value !== "()" ? search.value.replace(/^\(/, "with ").replace(/\)$/, "") : "");
    var valstripped = search.value.replace(/^\(/, "").replace(/\)$/, "").toLowerCase();
    searchNodes.forEach(child => {
      child.style.display = "none";
      var tags = child.querySelectorAll(".tagLabel");
      tags.forEach(tag => {
        if (tag.getAttribute("title").toLowerCase().includes(valstripped))
          child.style.display = "";
        else if (tag.innerHTML.toLowerCase().includes(valstripped))
          child.style.display = "";
      })
    });
  } else {
    overinput.style.display = "none";
    searchNodes.forEach(child => {
      child.style.display = "none";
      var name = child.querySelector(".linkname");
      if (name.innerHTML.toLowerCase().includes(value.toLowerCase()))
        child.style.display = "";
    });
  }
  sessionStorage.setItem("searchvalue", search.value); 
};

function toggleSidebar() {
  document.querySelector('#body').classList.toggle('sidebarOpen');
  sessionStorage.setItem("sidebar", document.querySelector("#body").className);
}

function opensearch(sq) {
  search.value = sq;
  onsearch();
  document.querySelector('#body').classList.add('sidebarOpen');
  sessionStorage.setItem("sidebar", document.querySelector("#body").className);
}

if (window.innerWidth > 800) {
  document.querySelector("#body").className = sessionStorage.getItem("sidebar");
}
search.value = sessionStorage.getItem("searchvalue");
onsearch();

overinput.addEventListener("click", () => {
  search.focus();
})

clearinput.addEventListener("click", () => {
  search.value = "";
  onsearch();
})
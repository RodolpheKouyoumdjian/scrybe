function resetFirepadContainer(tab) {
  const firepadContainer = document.getElementById("firepad-container");

  const elements = document.querySelectorAll(".firepad-double-container");
  elements.forEach((element) => {
    element.innerHTML = "";
  });
  var currentContainer = document.querySelector(
    `[data-w-tab="${tab}"].w-tab-pane`
  );
  currentContainer = currentContainer.querySelector(
    ".firepad-double-container"
  );
  currentContainer.appendChild(firepadContainer);
}

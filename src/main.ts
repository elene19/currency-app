import "./style.css";
import { router } from "./route";

const navigateTo = (url: string) => {
  history.pushState(null, "", url);
  router();
};

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `<div>




</div>`;

window.addEventListener("popstate", router);
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    // console.log(e.target.id, "afafaf");
    if ((e.target as HTMLAnchorElement).matches("[data-link]")) {
      e.preventDefault();
      navigateTo((e.target as HTMLAnchorElement).href);
      // console.log((e.target as HTMLAnchorElement).href);
    }
  });
  router();
});

const nav = document.querySelector("#nav");
const converterBtn = document.querySelector(".converter");
const exchangeBtn = document.querySelector(".exchange");
// exchangeBtn.addEventListener("click", () => {});

nav?.addEventListener("click", (e) => {
  if (!(e.target as HTMLAnchorElement).classList.contains("active")) {
    exchangeBtn?.classList.toggle("active");
    converterBtn?.classList.toggle("active");
  }
});

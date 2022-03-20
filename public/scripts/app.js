

import {themes} from "./themes.js";

const themeSwitcher = {
  init() {
    this.themes = themes;
    this.root = document.documentElement;

    this.activeThemeName = localStorage.getItem("activeThemeName")|| "cool";
    this.cacheElement();
    this.registerListeners();
    this.popularSelect();
    this.changeDOMTheme();
  },
  cacheElement() {
    this.$selectSwitcher = document.querySelector("#theme--switcher")
  },
  registerListeners() {
    this.$selectSwitcher.addEventListener("change", (e)=>{
      this.activeThemeName = e.target.value;
      localStorage.setItem("activeThemeName", e.target.value);
      this.changeDOMTheme();
    });
  },
  popularSelect() {
    console.log('test');
      const option = themes.map((theme)=>{
        console.log(theme);
        return `<option value="${theme.slug}" ${theme.slug == this.activeThemeName ? "selected" : ""
        }>${theme.name}</option>`;
      });
    this.$selectSwitcher.innerHTML = option.join("");
  },
  changeDOMTheme() {
    const activeTheme = this.themes.find((theme)=> theme.slug == this.activeThemeName);
    activeTheme.colors.forEach((color) => {
      this.root.style.setProperty(`--color-${color.name}`,color.hex);
    });
  },
};
themeSwitcher.init();

/*
document.querySelector('#add').onclick = function() {
    if(document.querySelector('#groceryForm input').value.length == 0) {
      alert('Pleas enter')
    }
    else{
      document.querySelector('#groceries').innerHTML += `
      <li>
      ${document.querySelector('#groceryForm input').value}
      
      </li> `
    }
  }
  */
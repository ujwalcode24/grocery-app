import User from "./User.js";

//pageSelectors
const login = document.querySelector(".login");
const signup = document.querySelector(".signup");
const grocery = document.querySelector(".grocery");

//querySelector
const createUserSubmitButton = document.querySelector(".signup__button");
const userSigninSubmitButton = document.querySelector(".login__button");
const addGroceryButton = document.querySelector(".grocery__itemsAddButton");
const deleteButton = document.querySelector(".grocery__listItems");
const logoutButton = document.querySelector(".grocery__logout");
const directToSignupButton = document.querySelector(".login__newUser");

//function

function loginView() {
  login.classList.remove("displayNone");
  signup.classList.add("displayNone");
  grocery.classList.add("displayNone");
}

function signupView() {
  login.classList.add("displayNone");
  signup.classList.remove("displayNone");
  grocery.classList.add("displayNone");
}

function groceryView() {
  login.classList.add("displayNone");
  signup.classList.add("displayNone");
  grocery.classList.remove("displayNone");
}

function createUSer(e) {
  e.preventDefault();
  const userSignupInput = document.querySelector(".signup__input");
  const currentUser = userSignupInput.value;
  if (currentUserExist(currentUser)) {
    alert("user already exist please login.");
    loginView();
  } else {
    let users = JSON.parse(localStorage.getItem("users"));
    if (users === null) {
      const newUser = new User(currentUser);
      saveToLocalStorageUser(newUser);
      loginView();
    } else if (users.length < 3) {
      const newUser = new User(currentUser);
      saveToLocalStorageUser(newUser);
      loginView();
    } else {
      alert("user limit exceeded");
    }
  }
  userSignupInput.value = "";
}

function signIn(e) {
  e.preventDefault();
  const userSigninInput = document.querySelector(".login__input");
  const currentUser = userSigninInput.value;
  console.log(currentUser);
  saveToLocalStorageCurrentUser(currentUser);
  userSigninInput.value = "";
  groceryListTemplate();
}

function groceryListTemplate() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser !== "") {
    const alluserDetals = JSON.parse(localStorage.getItem("users"));
    let allUsers = alluserDetals.filter(
      (user) => user.username === currentUser
    )[0].items;
    const listItemContainer = document.querySelector(".grocery__listItems");
    let listItemHTML = "";
    if (allUsers.length > 0) {
      allUsers.map(
        (item) =>
          (listItemHTML += ` <div class="grocery__listItemDiv">
        <li class="grocery__listItem">${item}</li>
        <button class="grocery__listItemButton">
          <i class="fas fa-trash"></i>
        </button>
      </div>`)
      );
      listItemContainer.innerHTML = listItemHTML;
    } else {
      listItemContainer.innerHTML = "<span>No grocery Items Found.</span>";
    }
  }
}

//local storage

function addItemtoLocalStorage() {
  const groceryInput = document.querySelector(".grocery__itemsInput");
  const groceryItem = groceryInput.value;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let allUserDetails = JSON.parse(localStorage.getItem("users"));
  let selectedUser = allUserDetails.filter(
    (user) => user.username === currentUser
  );
  let indexOfSelectedUser = allUserDetails.findIndex(
    (user) => user.username === currentUser
  );
  selectedUser[0].items.push(groceryItem);
  allUserDetails[indexOfSelectedUser] = selectedUser[0];
  localStorage.setItem("users", JSON.stringify(allUserDetails));
  groceryListTemplate();
}

function removeItemCheck(e) {
  const selectedDelete = e.target;
  if (selectedDelete.classList[0] === "grocery__listItemButton") {
    const itemToDelete = selectedDelete.parentElement.innerText;
    deleteFromLocalStorage(itemToDelete);
  }
}

function deleteFromLocalStorage(item) {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let allUserDetails = JSON.parse(localStorage.getItem("users"));
  let selectedUser = allUserDetails.filter(
    (user) => user.username === currentUser
  );
  let indexOfSelectedUser = allUserDetails.findIndex(
    (user) => user.username === currentUser
  );
  const itemArray = selectedUser[0].items.filter(
    (itemToDelete) => itemToDelete !== item
  );
  selectedUser[0].items = itemArray;
  allUserDetails[indexOfSelectedUser] = selectedUser[0];
  console.log(console.log(selectedUser[0]));
  localStorage.setItem("users", JSON.stringify(allUserDetails));
  groceryListTemplate();
}

function saveToLocalStorageUser(newUser) {
  let users = [];
  if (localStorage.getItem("users") === null) {
    users = [];
  } else {
    users = JSON.parse(localStorage.getItem("users"));
  }
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));
}

function saveToLocalStorageCurrentUser(currentUser) {
  if (currentUserExist(currentUser)) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    groceryView();
  } else {
    currentUser = "";
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
    alert("user does not exist");
  }
}

function currentUserExist(currentUser) {
  let allUserDetails = JSON.parse(localStorage.getItem("users"));
  if (allUserDetails !== null) {
    let allUsers = allUserDetails.map((userDetail) => userDetail.username);
    let userExist = allUsers.some((user) => user === currentUser);
    return userExist;
  }
}

//Event Listener
document.addEventListener("DOMContentLoaded", signupView);
createUserSubmitButton.addEventListener("click", createUSer);
userSigninSubmitButton.addEventListener("click", signIn);
addGroceryButton.addEventListener("click", addItemtoLocalStorage);
deleteButton.addEventListener("click", removeItemCheck);
logoutButton.addEventListener("click", loginView);
directToSignupButton.addEventListener("click", signupView);

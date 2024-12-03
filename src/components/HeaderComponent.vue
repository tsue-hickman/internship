<!-- HeaderComponent.vue -->
<template>
    <header class="header">
      <h1 class="header-title">My App</h1>
      <div class="search-bar">
        <input type="text" placeholder="Search app content..." />
        <button class="search-button">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </header>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent'
  }
  </script>
  
  <style>
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #333;
    color: #fff;
  }
  
  .search-bar {
    display: flex;
    align-items: center;
  }
  
  .search-bar input {
    padding: 0.5rem;
    border: none;
    border-radius: 4px;
    margin-right: 0.5rem;
  }
  
  .search-button {
    background-color: #007bff;
    color: #fff;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>
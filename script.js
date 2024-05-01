document.addEventListener("DOMContentLoaded", () => {
  // Fetching data using async/await
  let myArray;
  async function fetchDataUsingAsyncAwait() {
    try {
      const response = await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      myArray = data;
      populateTable(myArray);
      console.log("Data fetched using async/await:", data);
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
    }
  }

  function fetchDataUsingThen() {
    // use locally stored data for fetching twice because api is giving error on multiple requests
    fetch("./coinData.json")
      .then((response) => response.json())
      .then((data) => {
        console.log("Data fetched using then:", data);
        myArray = data;
        populateTable(data);
      })
      .catch((error) =>
        console.error("There was a problem with the fetch operation:", error)
      );
  }


  function populateTable(data) {
    const tbody = document.getElementById("tbody");
    tbody.innerHTML = "";
    data.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML += `
  <td class="col1"><img class="image" src=${item.image} alt="coin-image">${
        item.name
      }</td>
  <td>${item.symbol.toUpperCase()}</td>
  <td>$${item.current_price}</td>
  <td>$${item.total_volume.toLocaleString("en-US")}</td>
  <td class=${valueColor(item.price_change_percentage_24h)}>${
        item.price_change_percentage_24h
      }%</td>
  <td class="col6">Mkt Cap: $${item.market_cap.toLocaleString("en-US")}</td>
  `;
      tbody.appendChild(row);
    });
  }

  function valueColor(value) {
    if (value < 0) {
      return "red";
    } else {
      return "green";
    }
  }

  const searchInput = document.getElementById("search-input");

  searchInput.addEventListener("input", () => {
    const searchValue = searchInput.value.trim().toLowerCase();
    let filterData = myArray;
    if (searchValue !== "") {
      filterData = myArray.filter(
        (item) =>
          item.name.toLowerCase().includes(searchValue) ||
          item.symbol.toLowerCase().includes(searchValue)
      );
    }
    populateTable(filterData);
  });


  let isMktCapAscending = true;
  const sortByMktCap = document.getElementById("sort-mkt-cap");
  sortByMktCap.addEventListener("click", () => {
    if (isMktCapAscending) {
    const sortedData = myArray.sort((a, b) => parseFloat(a.market_cap) - parseFloat(b.market_cap));
    isMktCapAscending = false;
    populateTable(sortedData);

    } else {
      const sortedData = myArray.sort((a, b) => parseFloat(b.market_cap) - parseFloat(a.market_cap));
      isMktCapAscending = true;
    populateTable(sortedData);

    }

  });

  let isPercentAsc = true;
  const sortByPercent = document.getElementById("sort-percent");
  sortByPercent.addEventListener("click", () => {
    if (isPercentAsc) {
    const sortedData = myArray.sort((a, b) => parseFloat(a.price_change_percentage_24h) - parseFloat(b.price_change_percentage_24h));
    isPercentAsc = false;
    populateTable(sortedData);
  } else {
    const sortedData = myArray.sort((a, b) => parseFloat(b.price_change_percentage_24h) - parseFloat(a.price_change_percentage_24h));
    isPercentAsc = true;
    populateTable(sortedData);
  }
  });


  // Call the async function
  fetchDataUsingAsyncAwait();
  fetchDataUsingThen();
  
});

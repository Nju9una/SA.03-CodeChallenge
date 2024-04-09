document.addEventListener("DOMContentLoaded", () => {
  const baseUrl = "http://localhost:3000";
  const filmsUrl = `${baseUrl}/films`;

  // Function to fetch all films and populate the menu
  const fetchFilms = () => {
    fetch(filmsUrl)
      .then((response) => response.json())
      .then((films) => {
        const filmsList = document.getElementById("films");
        filmsList.innerHTML = "";
        films.forEach((film) => {
          const li = document.createElement("li");
          li.classList.add("film", "item");
          li.textContent = film.title;
          filmsList.appendChild(li);
          li.addEventListener("click", () => displayFilmDetails(film));
        });
        // Display details of the first film by default
        if (films.length > 0) {
          displayFilmDetails(films[0]);
        }
      })
      .catch((error) => console.error("Error fetching films:", error));
  };

  // Function to display details of a film
  const displayFilmDetails = (film) => {
    document.getElementById("title").textContent = film.title;
    document.getElementById("runtime").textContent = `${film.runtime} minutes`;
    document.getElementById("film-info").textContent = film.description;
    document.getElementById("showtime").textContent = film.showtime;
    const remainingTickets = film.capacity - film.tickets_sold;
    document.getElementById("ticket-num").textContent = remainingTickets;
    document.getElementById("poster").src = film.poster;
    if (remainingTickets === 0) {
      document.getElementById("buy-ticket").textContent = "Sold Out";
      document.getElementById("buy-ticket").disabled = true;
    } else {
      document.getElementById("buy-ticket").textContent = "Buy Ticket";
      document.getElementById("buy-ticket").disabled = false;
    }
    // Add event listener for buying a ticket
    document.getElementById("buy-ticket").addEventListener("click", () => buyTicket(film));
  };

  // Function to buy a ticket
  const buyTicket = (film) => {
    const updatedTicketsSold = film.tickets_sold + 1;
    fetch(`${baseUrl}/films/${film.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
    })
      .then((response) => response.json())
      .then(() => {
        // Update UI after buying ticket
        film.tickets_sold = updatedTicketsSold;
        displayFilmDetails(film);
      })
      .catch((error) => console.error("Error buying ticket:", error));
  };

  // Fetch films and populate menu on page load
  fetchFilms();
});

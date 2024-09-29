const content = document.querySelector("#content");
const button = document.querySelector("#button-random-dog");

const apiUrl = "https://dog.ceo/api/breeds/image/random";

button.addEventListener("click", async () => {
	try {
    const response = await fetch(apiUrl);
		console.log(response);
    const data = await response.json();
    const imgUrl = data.message;
    content.innerHTML = `<img src="${imgUrl}" alt="Random Dog Image">`;
  } catch (error) {
    console.error(error);
    content.innerHTML = "Error fetching random dog image.";
  }
})




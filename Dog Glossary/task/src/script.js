const divContent = document.getElementById('content');
const buttonRandomDog = document.getElementById('button-random-dog');
const img = document.getElementById('dog-image');
const url = 'https://dog.ceo/api/breeds/image/random';



buttonRandomDog.addEventListener('click', () => {
	fetch(url)
		.then(response => response.json())
		.then(data => {
			img.src = data.message;
		});
});
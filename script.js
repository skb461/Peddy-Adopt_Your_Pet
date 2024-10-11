document.addEventListener("DOMContentLoaded", function () {
    const apiUrl = "https://openapi.programming-hero.com/api/peddy/pets";
    const categoryApiUrl = "https://openapi.programming-hero.com/api/peddy/categories";
    const petContainer = document.getElementById("pet-container");
    const likedPetContainer = document.querySelector(".liked-pet");
    const spinnerContainer = document.getElementById("spinner-container");
    const sortButton = document.getElementById("sort-btn");

    let allPets = [];

    fetch(categoryApiUrl)
        .then(response => response.json())
        .then(data => {
            const categories = data.categories;
            createCategoryButtons(categories);
        })
        .catch(error => console.error("Error fetching category data:", error));

    function createCategoryButtons(categories) {
        const categoryContainer = document.createElement('div');
        categoryContainer.className = "grid grid-cols-1 lg:flex justify-center my-4";

        categories.forEach(category => {
            const button = document.createElement('button');
            button.className = "bg-transparent border border-gray-500 text-gray-700 py-10 px-20 text-2xl rounded-full mx-2 rounded hover:bg-gray-200 category-btn my-2";
            button.setAttribute('data-category', category.category.toLowerCase());
            button.innerHTML = `
                <img src="${category.category_icon}" alt="${category.category} icon" class="inline-block w-10 h-10 mr-2">
                ${category.category}
            `;
            categoryContainer.appendChild(button);

            button.addEventListener("click", function () {
                const selectedCategory = category.category.toLowerCase();
                showSpinner();

                const filteredPets = allPets.filter(pet => pet.category.toLowerCase() === selectedCategory);
                
                setTimeout(() => {
                    hideSpinner();
                    displayPets(filteredPets);
                }, 1000);
            });
        });

        document.body.insertBefore(categoryContainer, spinnerContainer);

        const sortButtonSection = sortButton.parentElement;
        sortButtonSection.parentElement.insertBefore(categoryContainer, sortButtonSection);
    }

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            allPets = data.pets;
            displayPets(allPets);
        })
        .catch(error => console.error("Error fetching pet data:", error));

    function displayPets(pets) {
        petContainer.innerHTML = "";
        if (pets.length === 0) {
            
            petContainer.innerHTML = `<div class="min-h-[300px] flex flex-col gap-5 justify-center items-center mx-auto">
            <img class="" src='images/error.webp' alt="Pet image">
            
            <h2 class="font-bold text-xl">No Information Available</h2>
            <p class="text-xs">It is a long established fact that a reader will be distracted by the readable content of a page when looking at 
its layout. The point of using Lorem Ipsum is that it has a.</p>
            </div>`;
            
            return;
        } 

        pets.forEach((pet, index) => {

            const petCard = `
                <div class="card border rounded-lg px-3 py-3">
                    <div class="">
                        <figure class="h-[200px]">
                            <img class="w-full h-full object-cover pet-image rounded-lg" src="${pet.image || 'images/placeholder.png'}" alt="Pet image">
                        </figure>    
                        <div class="px-0 py-3 ">
        
                            <h2 class="text-xl text-black font-bold">${pet.pet_name || 'Unknown'}</h2>
                            <div class="flex gap-4 py-1 text-xs text-gray-600">
                                <img src="images/Frame.png" class="w-6 h-6 mr-2" alt="">
                                <p class="text-gray-500">Breed: <span>${pet.breed || 'Not available'}</span></p>
                            </div>
                            <div class="flex gap-4 py-1 text-xs text-gray-600">
                                <img src="images/Vector.png" class="w-6 h-6 mr-2" alt="">
                                <p class="text-gray-500">Birth: <span>${pet.date_of_birth || 'Unknown'}</span></p>
                            </div>
                            <div class="flex gap-4 py-1 text-xs text-gray-600">
                                <img src="images/Frame (1).png" class="w-6 h-6 mr-2" alt="">
                                <p class="text-gray-500">Gender: <span>${pet.gender || 'Unknown'}</span></p>
                            </div>
                            <div class="flex gap-4 py-1 text-xs text-gray-600">
                                <img src="images/Vector.png" class="w-6 h-6 mr-2" alt="">
                                <p class="text-gray-500">Price: <span>${pet.price || 'Not available'}</span>$</p>
                            </div>
                            <div class="border-b my-5 border"></div>
                            <div class="flex justify-around mt-4">
                                <button class="bg-transparent border border-gray-500 text-gray-700 py-1 px-3 rounded hover:bg-gray-200 like-btn text-green-500">
                                    <img src="images/like.svg" class="w-6 h-6 mr-2" alt="">
        
                                </button>
                                <button class="adopt-btn bg-transparent border border-gray-500 text-gray-700 py-1 px-3 rounded hover:bg-gray-200 text-green-700 font-bold" data-adopted="false">Adopt</button>
                                <button class="bg-transparent border border-gray-500 text-gray-700 py-1 px-3 rounded hover:bg-gray-200 text-green-700 font-bold btn_details" data-pet-id="${pet.petId}">Details</button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            petContainer.innerHTML += petCard;
            
            document.querySelectorAll('.btn_details').forEach(button => {
                button.addEventListener('click', function () {
                    const petId = this.getAttribute('data-pet-id');
                    fetchPetDetails(petId);
                });
            });

        });
        
        document.querySelectorAll(".like-btn").forEach((button, index) => {
            button.addEventListener("click", function () {
                const petImage = document.querySelectorAll(".pet-image")[index].src;

                const likedPetImage = document.createElement("img");
                likedPetImage.src = petImage;
                likedPetImage.style.width = "124px";
                likedPetImage.style.height = "124px";
                likedPetImage.classList.add("m-1", "basis-1/2", "mx-auto","rounded-lg");

                likedPetContainer.appendChild(likedPetImage);
            });
        });

        const modal = document.getElementById('pet-modal');
        const countdownElement = document.getElementById('countdown');
        const messageElement = document.getElementById('message');
        const closeModalButton = document.getElementById('close-modal');
        const closeModalXButton = document.getElementById('close-modal-x');

        function openModal() {
            modal.classList.add('show');
            countdownElement.textContent = '3 seconds';
            messageElement.classList.add('hidden');
            closeModalButton.classList.add('hidden');

            let countdown = 3;
            const countdownInterval = setInterval(() => {
                countdown--;
                countdownElement.textContent = `${countdown} seconds`;

                if (countdown === 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);

            setTimeout(() => {
                modal.classList.remove('show');
            }, 3000);
        }

        closeModalXButton.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        closeModalButton.addEventListener('click', () => {
            modal.classList.remove('show');
        });

        function disableAdoptButton(button) {
            button.textContent = 'Adopted';
            button.disabled = true;
            button.setAttribute('data-adopted', 'true');
            button.classList.add('bg-gray-400', 'text-gray-600', 'cursor-not-allowed');
        }

        document.querySelectorAll('.adopt-btn').forEach((adoptButton) => {
            adoptButton.addEventListener('click', function () {
                if (adoptButton.getAttribute('data-adopted') === 'false') {
                    openModal();
                    setTimeout(() => {
                        disableAdoptButton(adoptButton); 
                    }, 3000);
                }
            });
        });

        function fetchPetDetails(petId) {
            const detailsUrl = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`;
        
            fetch(detailsUrl)
                .then(response => response.json())
                .then(data => {
                    const pet = data.petData;
                    
                    const petDetailsContent = document.getElementById('pet-details-content');
                    petDetailsContent.innerHTML = `
                        <img src="${pet.image || 'images/placeholder.png'}" class="w-full mt-5" alt="${pet.pet_name}">
                        <h2 class="text-2xl font-bold text-black">${pet.pet_name || 'Unknown'}</h2>
                        <p class="text-black"><strong>Breed:</strong> ${pet.breed || 'Not available'}</p>
                        <p class="text-black"><strong>Birth Date:</strong> ${pet.date_of_birth || 'Unknown'}</p>
                        <p class="text-black"><strong>Gender:</strong> ${pet.gender || 'Unknown'}</p>
                        <p class="text-black"><strong>Vaccinated Status:</strong> ${pet.vaccinated_status || 'Unknown'}</p>
                        <p class="text-black"><strong>Price:</strong> ${pet.price ? pet.price + '$' : 'Not available'}</p>
                        <p class="text-black"><strong>Description:</strong> ${pet.pet_details || 'No description available.'}</p>
                    `;
        
                    const petDetailsModal = document.getElementById("pet-details-modal");
                    petDetailsModal.classList.add("show");
                })
                .catch(error => console.error("Error fetching pet details:", error));
        }  

        const closeDetailsModal = document.getElementById('close-modal-x-details');

        closeDetailsModal.addEventListener('click', () => {
            const petDetailsModal = document.getElementById("pet-details-modal");
            petDetailsModal.classList.remove("show");
        });

        document.addEventListener('click', function (event) {
            if (event.target.classList.contains('btn_details')) {
                const petCard = event.target.closest('.w-96');
                const petIndex = Array.from(petContainer.children).indexOf(petCard);
                const petId = allPets[petIndex].id;

                fetchPetDetails(petId);
            }
        });
        
        sortButton.addEventListener("click", function () {
            const sortedPets = [...allPets].sort((a, b) => {
                const priceA = parseFloat(a.price) || 0;
                const priceB = parseFloat(b.price) || 0;
                return priceB - priceA;
            });
            displayPets(sortedPets);
        });
    }

    function showSpinner() {
        spinnerContainer.style.display = "flex";
        petContainer.style.display = "none"; 
    }

    function hideSpinner() {
        spinnerContainer.style.display = "none";
        petContainer.style.display = "grid";
    }
});

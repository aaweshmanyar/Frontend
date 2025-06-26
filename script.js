// Import Firebase modules (add this at the top of your file)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyC6tclAI1v3gmseON3S83AAzRGnQck-2Yo",
  authDomain: "naat-academy-3185b.firebaseapp.com",
  databaseURL: "https://naat-academy-3185b-default-rtdb.firebaseio.com",
  projectId: "naat-academy-3185b",
  storageBucket: "naat-academy-3185b.firebasestorage.app",
  messagingSenderId: "246903290372",
  appId: "1:246903290372:web:0d351dd6f1747aa4291351"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);



const topicsRef = collection(db, "topics");

  // Get DOM element
  const categoryButtonsContainer = document.getElementById("categoryButtons");

  // Fetch data and render buttons
  async function loadCategories() {
    const querySnapshot = await getDocs(topicsRef);

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const categoryName = data.topicName || "نامعلوم";
      const postCount = data.postCount || 25; // Assumes you store this count in Firestore
      const bgcolor = data.color || '#3712b0';
      console.log("The data is here", categoryName)

      // Create button
      const button = document.createElement("button");
      button.className = `category-tag urdu-text-xs category-${categoryName} bg-[${bgcolor}] text-white text-shadow-2xl header-category-tag`;
      button.setAttribute("data-category", categoryName);

      // Inner span structure
      button.innerHTML = `
        <span class="category-name">${categoryName}</span>
        <span class="category-post-count">${postCount}</span>
      `;

      categoryButtonsContainer.appendChild(button);
    });
  }


  const loadSpecialOffering = async () => {
  try {
    // Initialize Firebase if not already done
    const postsRef = db.collection('kalamPosts'); // Change 'posts' to your collection name
    const snapshot = await postsRef.limit(7).get(); // Limit to 7 posts

    const wrapper = document.querySelector('#peshkashSlider .slider-wrapper');
    wrapper.innerHTML = ''; // Clear existing slides

    if (snapshot.empty) {
      console.warn("No posts found");
      return;
    }

    snapshot.forEach(doc => {
      const post = doc.data();
      const lines = post.postUrdu // Assuming field is named postUrdu in Firestore
        .split(/،|\n|\.|\r|!|\?|(?<=ہیں)/)
        .map(line => line.trim())
        .filter(line => line.length > 0);

      const couplet = lines.slice(0, 2).join('<br>');
      const poet = post.writer || ''; // Assuming field is named writer in Firestore

      const slide = document.createElement('div');
      slide.className = 'slider-slide p-4 text-center special-offering-slide-content';
      slide.innerHTML = `
        <p class="urdu-text urdu-text-lg sm:urdu-text-xl text-gray-800 leading-loose max-w-2xl mx-auto special-offering-slide-couplet">
          ${couplet}
        </p>
        <p class="urdu-text urdu-text-xs sm:urdu-text-sm text-gray-600 block mt-3 special-offering-slide-poet">
          ${poet}
        </p>
      `;

      wrapper.appendChild(slide);
    });

    // After injecting new slides, re-init the slider
    initSlider('peshkashSlider');

  } catch (error) {
    console.error("Error loading special offering:", error);
  }
};



async function loadwritersCards() {
  try {
    // Reference to your poets collection in Firestore
    const poetsRef = collection(db, "writers");
    const querySnapshot = await getDocs(poetsRef);
    
    // Get the container where cards will be inserted
    const container = document.getElementById("poets-container"); // You'll need to add this ID to your HTML
    
    // Clear existing content if needed
    container.innerHTML = '';
    
    // Loop through each poet document
    querySnapshot.forEach((doc) => {
      const poet = doc.data();
      
      // Create a new card element
      const card = document.createElement("article");
      card.className = "card p-5 poet-card transform transition-all hover:scale-105 bg-gray-50";
      
      // Set the card's inner HTML using the poet data
      card.innerHTML = `
        <div class="poet-icon-container poet-icon-gradient-1">
          <img src="${poet.imageUrl || 'https://res.cloudinary.com/awescreative/image/upload/v1749156252/Awes/writer.svg'}" 
               alt="${poet.writerName} Icon" class="poet-icon-image">
        </div>
        <h5 class="urdu-text urdu-text-base sm:urdu-text-md font-semibold text-gray-800 poet-name">${poet.writerName}</h5>
        <p class="urdu-text urdu-text-xs text-gray-600 mb-1 poet-lifespan">ولادت: 1856 - وفات: 1921</p>
        <p class="urdu-text urdu-text-xs text-gray-700 leading-snug poet-description line-clamp-1">${poet.aboutWriter}</p>
        <p class="urdu-text urdu-text-xs text-green-600 mt-2 font-semibold poet-kalaam-count">کلام: 200+</p>
        <div class="stats-bar justify-center poet-stats-bar">
          <span><i class="bi bi-heart-fill text-red-500"></i> 
            <span class="like-count urdu-text-xs">20</span>
          </span>
          <span><i class="bi bi-eye-fill text-blue-500"></i> 
            <span class="view-count urdu-text-xs">100</span>
          </span>
          <button class="share-icon-button"><i class="bi bi-share-fill"></i></button>
        </div>
      `;
      
      // Add the card to the container
      container.appendChild(card);
    });
    
  } catch (error) {
    console.error("Error loading poet cards:", error);
  }
}


loadwritersCards()

  loadCategories();
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

  loadCategories();
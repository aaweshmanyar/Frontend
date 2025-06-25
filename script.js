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

async function fetchAndCreateTopicButtons() {
  try {
    const topicsContainer = document.querySelector('.header-category-buttons-wrap');
    topicsContainer.innerHTML = ''; // Clear existing content

    // Get all documents from the topics collection
    const snapshot = await firebase.firestore().collection('topics').get();
    
    // Create a map to count posts per category and store colors
    const categories = {};
    
    // First pass to count posts and collect category data
    snapshot.forEach(doc => {
      const data = doc.data();
      if (data.category) {
        if (!categories[data.category]) {
          categories[data.category] = {
            count: 0,
            color: data.color || '#e5e7eb' // Default color if not specified
          };
        }
        categories[data.category].count++;
      }
    });

    // Create buttons for each category
    for (const [categoryName, categoryData] of Object.entries(categories)) {
      const button = document.createElement('button');
      button.className = 'category-tag urdu-text-xs header-category-tag';
      button.setAttribute('data-category', categoryName);
      
      // Set dynamic background color from Firebase
      button.style.backgroundColor = categoryData.color;
      
      // Add hover effect
      button.style.transition = 'background-color 0.3s';
      button.addEventListener('mouseover', () => {
        button.style.backgroundColor = darkenColor(categoryData.color, 20);
      });
      button.addEventListener('mouseout', () => {
        button.style.backgroundColor = categoryData.color;
      });

      const nameSpan = document.createElement('span');
      nameSpan.className = 'category-name';
      nameSpan.textContent = categoryName;
      
      const countSpan = document.createElement('span');
      countSpan.className = 'category-post-count';
      countSpan.textContent = `(${categoryData.count})`;
      
      button.appendChild(nameSpan);
      button.appendChild(countSpan);
      topicsContainer.appendChild(button);
    }

  } catch (error) {
    console.error("Error fetching topics:", error);
    // Fallback to default buttons if there's an error
    topicsContainer.innerHTML = `
      <button data-category="نعت" class="category-tag urdu-text-xs category-naat header-category-tag"><span class="category-name">نعت</span> <span class="category-post-count">(0)</span></button>
      <button data-category="سلام" class="category-tag urdu-text-xs category-salam header-category-tag"><span class="category-name">سلام</span> <span class="category-post-count">(0)</span></button>
      <button data-category="منقبت" class="category-tag urdu-text-xs category-manqabat header-category-tag"><span class="category-name">منقبت</span> <span class="category-post-count">(0)</span></button>
      <button data-category="قطعات" class="category-tag urdu-text-xs category-qataat header-category-tag"><span class="category-name">قطعات</span> <span class="category-post-count">(0)</span></button>
      <button data-category="موضوعات" class="category-tag urdu-text-xs category-mawzoat header-category-tag"><span class="category-name">موضوعات</span> <span class="category-post-count">(0)</span></button>
      <button data-category="شاعر" class="category-tag urdu-text-xs category-shayar header-category-tag"><span class="category-name">شاعر</span> <span class="category-post-count">(0)</span></button>
      <button data-category="مضامین" class="category-tag urdu-text-xs category-mazameen header-category-tag"><span class="category-name">مضامین</span> <span class="category-post-count">(0)</span></button>
      <button data-category="کتب" class="category-tag urdu-text-xs category-kutub header-category-tag"><span class="category-name">کتب</span> <span class="category-post-count">(0)</span></button>
    `;
  }
}

// Helper function to darken colors for hover effect
function darkenColor(color, percent) {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) - amt;
  const G = (num >> 8 & 0x00FF) - amt;
  const B = (num & 0x0000FF) - amt;
  
  return '#' + (
    0x1000000 +
    (R < 0 ? 0 : R) * 0x10000 +
    (G < 0 ? 0 : G) * 0x100 +
    (B < 0 ? 0 : B)
  ).toString(16).slice(1);
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', fetchAndCreateTopicButtons);
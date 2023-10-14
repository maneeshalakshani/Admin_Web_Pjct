import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-firestore.js";
import { firestoreDB } from './configurations.js';

function getAllFAQ() {
    const inquiriesCollection = collection(firestoreDB, "FAQ");

    getDocs(inquiriesCollection)
        .then((querySnapshot) => {
            const faqList = document.getElementById("faqList");
            faqList.innerHTML = ""; // Clear existing content
            let questionNumber = 1;

            querySnapshot.forEach((doc) => {
                const faqData  = doc.data();
                const question = faqData.question;
                const answer = faqData.answer;

                const faqItem = document.createElement("div");
                faqItem.classList.add("faq-item");

                const questionElement = document.createElement("div");
                questionElement.classList.add("faq-question");
                questionElement.innerHTML = `${questionNumber}. ${question}`;

                const answerElement = document.createElement("div");
                answerElement.classList.add("faq-answer");
                answerElement.innerHTML = `${answer}`;

                faqItem.appendChild(questionElement);
                faqItem.appendChild(answerElement);

                faqList.appendChild(faqItem);
                 questionNumber++;
            });
        })
        .catch((error) => {
            console.error("Error getting inquiries:", error);
        });
}

// Event listener to show the "Add FAQ" form
const addFAQButton = document.getElementById("addFAQButton");
const addFAQForm = document.getElementById("addFAQForm");

addFAQButton.addEventListener("click", () => {
    addFAQForm.style.display = "block";
    addFAQButton.style.display = "none";
});

// Event listener to submit a new FAQ
const submitFAQButton = document.getElementById("submitFAQButton");

submitFAQButton.addEventListener("click", () => {
    const questionInput = document.getElementById("questionInput");
    const answerInput = document.getElementById("answerInput");
    const errorMessage = document.getElementById("errorMessage");

    // Clear previous error message
    errorMessage.textContent = "";

    // Get the question and answer values from input fields
    const question = questionInput.value;
    const answer = answerInput.value;

    // Check if question and answer fields are empty
    if (!question || !answer) {
        errorMessage.textContent = "Both question and answer are required!";
    } else {
        // Add the new FAQ to Firestore
        addFAQToFirestore(question, answer);

        // Clear input fields
        questionInput.value = "";
        answerInput.value = "";

        // Hide the "Add FAQ" form
        addFAQForm.style.display = "none";
        addFAQButton.style.display = "block";
    }
});

// Function to add a new FAQ to Firestore
function addFAQToFirestore(question, answer) {
    const faqCollection = collection(firestoreDB, "FAQ");

    // Add the new FAQ to Firestore
    addDoc(faqCollection, {
        question: question,
        answer: answer
    })
        .then(() => {
            // Refresh the FAQ list
            getAllFAQ();
        })
        .catch((error) => {
            console.error("Error adding FAQ:", error);
        });
}

window.onload = function () {
    getAllFAQ();
};
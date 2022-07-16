import fetch from "node-fetch"
import shuffle from "./shuffle.js"

async function getQuestions() {
    try {
        const res = await fetch("https://the-trivia-api.com/api/questions?limit=5")
        const data = await res.json()

        const questionsData = data.map(item => {
            return {
                id: item.id,
                question: item.question,
                options: shuffle([...item.incorrectAnswers, item.correctAnswer]),
                correct_answer: item.correctAnswer
            }
        })

        return questionsData
    } catch (error) {
        throw error
    }
}

export default getQuestions
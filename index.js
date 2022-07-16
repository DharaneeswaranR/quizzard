#!/usr/bin/env node

//   /$$$$$$            /$$                                               /$$
//  /$$__  $$          |__/                                              | $$
// | $$  \ $$ /$$   /$$ /$$ /$$$$$$$$ /$$$$$$$$  /$$$$$$   /$$$$$$   /$$$$$$$
// | $$  | $$| $$  | $$| $$|____ /$$/|____ /$$/ |____  $$ /$$__  $$ /$$__  $$
// | $$  | $$| $$  | $$| $$   /$$$$/    /$$$$/   /$$$$$$$| $$  \__/| $$  | $$
// | $$/$$ $$| $$  | $$| $$  /$$__/    /$$__/   /$$__  $$| $$      | $$  | $$
// |  $$$$$$/|  $$$$$$/| $$ /$$$$$$$$ /$$$$$$$$|  $$$$$$$| $$      |  $$$$$$$
// \____ $$$ \______/ |__/|________/|________/ \_______/|__/       \_______/
//      \__/                                                                
                                                                         
                                                                         
import chalk from 'chalk'
import inquirer from 'inquirer'
import gradient from 'gradient-string'
import chalkAnimation from 'chalk-animation'
import figlet from 'figlet'
import { createSpinner } from 'nanospinner'
import getQuestions from './utils/getQuestions.js'

let playerName
let questions

const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms))

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow("Are you a Quiz Wizzard?")

    await sleep()
    rainbowTitle.stop()

    console.log(`${chalk.blue("HOW TO PLAY?")}\nChoose the right answer `)
}

async function askName() {
    const answer = await inquirer.prompt({
        name: "player_name",
        type: "input",
        message: "What is your name?",
        default() {
            return "Player"
        } 
    })

    playerName = answer.player_name
}

async function handleAnswer(isCorrect) {
    const spinner = createSpinner("Checking answer...").start()
    await sleep()

    if (isCorrect) {
        spinner.success({
            text: `Well done ${playerName} 👏👏👏. That's a right answer`
        })
    } else {
        spinner.error("Oops 🤦‍♀️! That's a wrong answer")
    }
}

async function setQuestions() {
    try {
        questions = await getQuestions()
    } catch (error) {
        console.log(chalk.red("Error fetching questions data"))
        process.exit(1)
    }
}

async function question({ id, question, options, correct_answer }) {
    const answers = await inquirer.prompt({
        name: id,
        type: 'list',
        message: `${question}\n`,
        choices: options
    })

    await handleAnswer(answers[id] === correct_answer)
}

async function displayQuestions() {
    for (let item of questions) {
        await question(item)
    }
}

setQuestions()
await welcome()
await askName()
await displayQuestions()
// console.log(questions)
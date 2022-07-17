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

let playerName, questions, score = 0

const sleep = (ms = 2000) => new Promise(r => setTimeout(r, ms))

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow("Are you a Quiz Wizzard?\n")

    await sleep()
    rainbowTitle.stop()

    console.log(`${chalk.blue("HOW TO PLAY?")}\nChoose the right answer\n`)
}

function congrats() {
    console.clear()
    const msg = `Congrats ${playerName}!`
    
    figlet(msg, (err, data) => {
        console.log(gradient.pastel.multiline(data) + '\n')
        console.log(chalk.green(`You scored ${score}/5`))

        process.exit(0)
    })
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
            text: `Well done ${playerName} 👏👏👏. That's a right answer\n`
        })
        score++
    } else {
        spinner.error({
            text: "Oops 🤦! That's a wrong answer\n"
        })
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
        message: `${question}`,
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
congrats()
// console.log(questions)
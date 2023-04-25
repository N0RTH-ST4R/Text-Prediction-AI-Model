const prompt=require("prompt-sync")()
const fs=require("fs")

//AI Stuff
var words=[]


function addWord(word,before){
    let cont=true
    for(let i=0;i<words.length;i++){
        if(words[i].text==word){
            cont=false
        }
    }
    if(cont){
        words.push(new Word(word,before))
    }else{
        for(let i=0;i<words.length;i++){
            if(words[i].text==word){
                words[i].useTimes+=1
            }
        }
    }
}
function nextWord(word){
    let useWord=word.next[0]
    for(let i=0;i<word.next.length;i++){
        if(word.next[i].useTimes>useWord.useTimes){
            useWord=word.next[i]
        }
    }
    return useWord
}
function scanWordsFor(text){
    let ind=null
    for(let i=0;i<words.length;i++){
        if(words[i].text==text){
            ind=i
        }
    }
    return ind
}
function linkWords(){
    for(let i=1;i<words.length;i++){
        if(!words[scanWordsFor(words[i].before)].next.includes(words[i].text))
        words[scanWordsFor(words[i].before)].next.push(words[i].text)
    }
}
class Word{
    constructor(text,before){
        this.text=text
        this.before=before
        this.next=[]
        this.useTimes=1
    }
}
addWord("",null)
//Display Stuff
var text=""
var prediction=""

function aiUpdate(){
    var splText=text.split(" ")
    for(let i=0;i<splText.length;i++){
        if(i>0){
            addWord(splText[i],splText[i-1])
        }else{
            addWord(splText[i],"")
        }
    }
    linkWords()
    writeWords()
}

var trainingSentences=[
    "he is my cousin",
    "are you hungry?",
    "are you married?",
    "are you thirsty?",
    "be seated, please",
    "can you speak english?",
    "dinner is ready",
    "do you understand?",
    "do you want some bread?",
    "do you want some rest?",
    "don't mention it",
    "glad to see you"
]

function train(){
    addSentences()
    for(let i=0;i<trainingSentences.length;i++){
        text=trainingSentences[i]
        aiUpdate()
    }
}

function addSentences(){
    let s=fs.readFileSync(__dirname+"/sentences.txt",'utf8')
    let s2=s.split("\n")
    for(let i=0;i<s2.length;i++){
        trainingSentences.push(s2[i])
    }
}
function writeSentence(sentence){
    let text=fs.readFileSync(__dirname+"/sentences.txt",'utf8')
    text=text+sentence+"\n"
    fs.writeFile(__dirname+"/sentences.txt",text,function(){})
}
function writeWords(){
    let text=""
    for(let i=0;i<words.length;i++){
        text=text+"Word: ["+words[i].text+"], before: ["+words[i].before+"], next: ["+words[i].next+"], useTimes: ["+words[i].useTimes+"]\n \n"
    }
    fs.writeFile(__dirname+"/words.txt",text,function(){})
}

aiUpdate()
writeWords()
function doTrain(){
    let bool=prompt("Train? [Y/n]>> ")
    if(bool=="Y" || bool=="y" || bool==""){
        train()
    }
}
doTrain()
setInterval(()=>{
    console.clear()
    console.log("Welcome! Type anything you want and watch it be stored in words.txt")
    console.log("type .quit to exit")
    text=prompt(">> ")
    if(text!=".quit"){
        aiUpdate()
        writeSentence(text)
    }else{
        process.exit(0)
    }
})

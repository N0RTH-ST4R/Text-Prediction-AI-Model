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
var text="Hello how are you are you well"
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

function train(){
    text="are you hungry?"
    aiUpdate()
    text="are you married?"
    aiUpdate()
    text="are you thirsty?"
    aiUpdate()
    text="be seated, please"
    aiUpdate()
    text="can you speak english?"
    aiUpdate()
    text="dinner is ready"
    aiUpdate()
    text="do you understand?"
    aiUpdate()
    text="do you want some bread?"
    aiUpdate()
    text="do you want some rest"
    aiUpdate()
    text="don't mention it"
    aiUpdate()
    text="glad to see you"
    aiUpdate()
    text="he is my cousin"
    aiUpdate()
}

function writeWords(){
    let text=""
    for(let i=0;i<words.length;i++){
        text=text+"Word: ["+words[i].text+"], before: ["+words[i].before+"], next: ["+words[i].next+"], useTimes: ["+words[i].useTimes+"]\n \n"
    }
    fs.writeFile(__dirname+"/words.txt",text,function(){})
}

train()
aiUpdate()
text="Hi i am well how about you"
aiUpdate()
writeWords()
setInterval(()=>{
    console.clear()
    console.log("Welcome! Type anything you want and watch it be stored in words.txt")
    console.log("type .quit to exit")
    text=prompt(">> ")
    if(text!=".quit"){
        aiUpdate()
    }else{
        process.exit(0)
    }
})

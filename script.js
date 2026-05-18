import movies from './content.js'
import OpenAI from "openai";
import { createClient } from '@supabase/supabase-js';
const supabase = createClient('https://lhflnccqofhscnbjcdfi.supabase.co', import.meta.env.VITE_SUPABASE_KEY)
const openai = new OpenAI({ apiKey: import.meta.env.VITE_OPENAI_API_KEY, dangerouslyAllowBrowser: true})

// uploadMovies()
// Only needed to run upload movies 1 time to get movies from Connect.js into supabase


// Selectors
const formEl = document.getElementById("recForm")
const favInputEl = document.getElementById("q1")
const chipsEl = document.querySelectorAll(".chip")
const formViewEl = document.getElementById("formView")
const resultsViewEl = document.getElementById("resultsView")
const reslultsText = document.getElementById("resultsText")
// const resultsGridEl = document.getElementById("resultsGrid")
const backBtnEl = document.getElementById("backBtn")
const ctaBtnEl = document.querySelector(".cta-btn")

const eraChipEl = document.querySelectorAll('.chip[data-group="era"]')
const moodChipEl = document.querySelectorAll('.chip[data-group="mood"]')

let eraPreference = ""
let moodPreference = ""


// MAIN Function
async function main(input){
    ctaBtnEl.classList.add('swell-animation')
    let combinedQuery = inputCombinator()
    let queryEmbedding = await getEmbedding(combinedQuery)
    let match = await matchEmbed(queryEmbedding)
    recommendation(queryEmbedding, match)
    // ctaBtnEl.classList.remove('swell-animation')

    console.log('query Embedding before match embed', queryEmbedding)
    console.log('embedding type', Array.isArray(queryEmbedding), queryEmbedding.length)
}

// Final form submissision
formEl.addEventListener('submit', (e)=>{
    e.preventDefault()
    console.log("submit")
    main() 
})

// Back button trigger
backBtnEl.addEventListener('click', (e)=>{
    formViewEl.style.display = 'block'
    resultsViewEl.style.display = 'none'
    console.log("submit")
})

// Chip selectors
eraChipEl.forEach(chip=>{
    chip.addEventListener('click', (e)=>{
        eraChipEl.forEach(innerChip=>{
            innerChip.classList.remove('chip--selected')
        })
        chip.classList.add('chip--selected')
        eraPreference = chip.dataset.value
        console.log('selected:', chip.dataset.value)
    })
})

moodChipEl.forEach(chip=>{
    chip.addEventListener('click', (e)=>{
        moodChipEl.forEach(innerChip=>{
            innerChip.classList.remove('chip--selected')
        })
        chip.classList.add('chip--selected')
        moodPreference = chip.dataset.value
        console.log('selected:', chip.dataset.value)
    })
})





// Create & combine query
function inputCombinator(){
let query = `I'm looking for a movie to watch.
I'm in the mood for something ${eraPreference} that is ${moodPreference}.
And to help you make a recommendation, 
In the following lines, I'll tell you a title and why it's my favorite movie:
${favInputEl.value}`
console.log(query)
return query
}

// Get embedding for query or movie items
async function getEmbedding(input) {
  const embedding = await openai.embeddings.create({
  model: "text-embedding-3-small",
  input: input,
  encoding_format: "float",
});
// console.log('embedding here', embedding.data[0].embedding)
const response = embedding.data[0].embedding
return response
}

// Match the generated query embedding with a movie embedding in supabase
async function matchEmbed(embedding) {
const { data: movieMatch, error } = await supabase.rpc('match_documents', {
  query_embedding: embedding,
  match_threshold: 0.3,
  match_count: 10,
})
console.log('match function', movieMatch, error)
console.log('match function score tester', movieMatch.map(m => ({title: m.title, similarity: m.similarity})))

return movieMatch
}

// Final recommendation ads query + the match finding into an answer
async function recommendation(queryEmbedding, match) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    store: true,
    messages: [
        { role: "system", 
        content: "You are a helpful movie buff who is great at giving movie recommendations." },
        { role: "user", 
        content: `Offer me the most relevant movie recommendation from this list of ${JSON.stringify(match)} that aligns with my original 
        ${favInputEl.value} and explain the relevance to the specified input value. Be sure to restate the original input value for clarity.
        At the end, make a double paragraph break and list only the titles of available movies, not already named in this response that are also in the list as other matches.`},
    ],
  });
  console.log('AI Suggestion:', completion.choices[0].message.content);

//   Display Results
  ctaBtnEl.classList.remove('swell-animation')
  formViewEl.style.display = 'none'
  resultsViewEl.style.display = 'block'
  reslultsText.textContent = completion.choices[0].message.content
}














// Upload Movies 1 Time
async function uploadMovies(x){
    await Promise.all(
movies.map(async item=>{
    const embedding = await getEmbedding(item.content)
    const movieEmbed = embedding
    // const movieEmbed = embedding.data[0].embedding
    // console.log('movieEmbed Test', movieEmbed)

    // Supabase movie upload
const movieUploads = await supabase.from('movies').insert({
        title: item.title,
        releaseYear: item.releaseYear,
        content: item.content,
        embedding: movieEmbed
})
console.log('movie Uploads Variable', movieUploads)
})
    )   
}






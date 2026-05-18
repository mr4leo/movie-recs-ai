Movie reccomendation

Text box input field: Are you in the mood for something Fun or serious
Text box: New or classic?
Text box: What is your Fav movie & why

Input elements
listen for click on submit then run Main function 
listen for enter on input field then Main function 
lsten for clicks on chips

let datePreference = "new" / "classic"
let moodPreference = "fun" / "serious"
_______________________________________


inputCombination function runs 1st

FUNCTION
async MAIN function:
async queryToEmbedding function runs 2nd
async matchMaker function runs 3rd

FUNCTION
query = inputCOmbination function
Combine text into new ultra prompt / query
I'm looking for a movie to watch.
I'm in the mood for something + input value, that is input value (new / classic, fun / serious).
To help you make a recommendation, I'll tell you whay my favorite movie is and why it's my favorite. 
+ Input

_____________________

FUNCTION
convert query to embedding
embedding = queryToEmbedding function

find that data obj in the embedding? embedding.data[0]embedding?
--------------------

match.data??
They want me to use content JS as a vector database to run matches on.
So I believe, in a new script file, I would run a loop over the items in content js, to turn each item into an embedding and store those titles plus their veoctrs as 2 property objects in supabase

Then I'd run the match method on my embedded response, and the list of embeddings in the database using the match_documents rpc method

chat completions
system role: You're a movie buff respected for personalized movie reccomendations. Based on the user's preferences, recommend a movie for them to watch from the list included in (match.data???).
user: query

loading state animation, 3 dots or pulsing text box

update inner html w <p>
and beneath, a btn for new recommendation that resets the app.




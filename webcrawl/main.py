from webcrawl import get_website_content
from gemini import LLM
from fastapi import FastAPI, HTTPException, Request
from mongo import add_user, remove_user, create_convo, add_convo, get_convo, hash_password, verify_password, find_user_by_email, validate_google_token, get_all_convo
from mongo import User, GoogleAuth, ConversationRequest
from typing import Optional
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI()

model = LLM()

# url = 'http://stu.globalknowledgetech.com:3000/gkcloud/course/prompt-engineering-for-gen-ai'
# content = get_website_content(url)
# print(content)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (use ["https://en.wikipedia.org"] for specific domains)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

@app.post("/create_convo")
def create_conversation(request: ConversationRequest):
    # Access the data from the request body
    user_id = request.user_id
    website_url = request.website_url
    model.set_knowledge_base(get_website_content(website_url))
    print(model.knowledge_base)
    # Process the conversation
    print("Website URL:", website_url)
    
    # Assuming create_convo is a function that processes the user_id and website_url
    convo = create_convo(user_id, website_url)
    
    if convo:
        return convo
    else:
        return {"Error": "Error creating conversation"}

@app.get("/get_convo/{convo_id}")
def get_convo_session(convo_id : str):
    output = get_convo(convo_id)
    return {
        "convo_id" : output["convo_id"],
        "user_id": output["user_id"],
        "created_at": output["created_at"],
        "web_content" : output["web_content"],
        "convo": output["convo"],
        "reached_limit" : output["reached_limit"],
        "limit" : output["limit"],
    }

@app.post("/generate_answer/{convo_id}")
async def generate(convo_id : str ,request: Request):
    query = await request.json()
    print(query)
    response = model.get_answer(query["query"])
    print(response)
    added = add_convo(convo_id, query["query"], response)
    if added:
        return {
            "message" :  response
            }
    else:
        return {"error" : "error while generation"}    

@app.post("/signup", response_model=dict)
async def signup(user: User):
    # Check if user already exists
    if find_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="User exists")

    # Hash the password
    hashed_password = hash_password(user.password)
    
    # Save user to the database
    user_data = {
        "email": user.email,
        "password": hashed_password,
        "username": user.username,
        "auth_method": "email",
    }
    result = add_user(user_data)
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}

@app.post("/signin", response_model=dict)
async def signin(user: User):
    # Check if user already exists
    if not find_user_by_email(user.email):
        raise HTTPException(status_code=400, detail="User does not exists")

    # Hash the password
    hashed_password = hash_password(user.password)
    
    # Save user to the database
    user_data = {
        "email": user.email,
        "password": hashed_password,
        "username": user.username,
        "auth_method": "email",
    }
    result = verify_password(user.password, user.email)
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}


@app.post("/google-auth", response_model=dict)
async def google_auth(google_auth: GoogleAuth):
    # Validate Google ID token
    user_info = validate_google_token(google_auth.id_token)

    email = user_info.get("email")
    name = user_info.get("name")

    # Check if user exists
    existing_user = find_user_by_email(email)
    if existing_user:
        if existing_user["auth_method"] != "google":
            raise HTTPException(status_code=400, detail="Email already registered with a different method")
        return {"message": "Login successful", "user_id": str(existing_user["_id"])}

    # Create new user
    user_data = {
        "email": email,
        "username": name,
        "created_at": datetime.now(),
        "auth_method": "google",
    }
    result = users.insert_one(user_data)
    return {"message": "User created successfully", "user_id": str(result.inserted_id)}


@app.get("/get-all-conv/{user_id}")
def get_all_conversation(user_id : str, web_url : Optional[str] = None):
    result = get_all_convo(user_id, web_url)
    return result


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)    
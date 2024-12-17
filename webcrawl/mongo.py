from pymongo import MongoClient
from datetime import datetime
import uuid
from webcrawl import get_website_content
from pydantic import BaseModel, EmailStr
from bson import ObjectId
from google.oauth2 import id_token
from google.auth.transport import requests
import bcrypt


client = MongoClient("mongodb+srv://Aishwarya:user@cluster0.c2vkm.mongodb.net/")
db = client.Webchatter

class User(BaseModel):
    email: EmailStr
    password: str
    username: str | None = None

class ConversationRequest(BaseModel):
    user_id: str
    website_url: str



class GoogleAuth(BaseModel):
    id_token: str

convo = db.Convo_db
users = db.user_db

def add_user(user_data):
    current_date = datetime.now().date().strftime("%Y-%m-%d")
    user_id = str(uuid.uuid4())
    # Create a user document
    U = {
        "email": user_data["email"],
        "password": user_data["password"],
        "username": user_data["username"],
        "created_at": current_date,
        "Active" : True,
        "Inactive_from" : None,
        "auth_method": "email",
    }

    # Insert the user document into the MongoDB collection
    result = users.insert_one(U)
    return result


def remove_user(user_id):
    user = user.find_one({"user_id": user_id})
    current_date = datetime.now().date().strftime("%Y-%m-%d")
    if not user:
        return f"User with email {email} not found."

    # Update the Active field to False
    user_db.update_one({"email": email}, {"$set": {"Active": False, "Inactive_from" : current_date}})
    return f"User {email} has been marked as inactive."




def create_convo(user_id, website_url):
    current_date = datetime.now().date().strftime("%Y-%m-%d")
    convo_id = str(uuid.uuid4())
    # Create a user document
    data = {
        "convo_id" : convo_id,
        "user_id": user_id,
        "created_at": current_date,
        "web_url" : website_url,
        "convo":[],
        "reached_limit" : False,
        "limit" : 10
    }

    result = convo.insert_one(data)
    return {
        "convo_id" : convo_id
    }


def add_convo(convo_id, query, response):
    c = convo.find_one({"convo_id": convo_id})
    if c == None:
        return "Convo not found"
    data = {
        "user":query,
        "response" : response
    }

    result = convo.update_one(
        {"convo_id": convo_id},
        {"$push": {"convo": data}}
    )
    print(c["limit"])
    print(len(c["convo"]))
    if len(c["convo"]) == c["limit"]:
        result = convo.update_one(
            {"convo_id": convo_id},
            {"$set": {"reached_limit": True}}
        )
    if result.matched_count == 0:
        return 0
    
    return convo_id


def get_convo(convo_id):
    output = convo.find_one({"convo_id": convo_id})
    print(output)
    if output == None:
        return "Convo not found"
    return output    


def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed.decode('utf-8')


def verify_password(password: str, email: str) -> bool:
    hashed_password = user.find_one({"email" : email})["hashed_password"]
    return bcrypt.checkpw(password.encode('utf-8'), hashed_password.encode('utf-8'))


def find_user_by_email(email: str):
    return users.find_one({"email": email})


def validate_google_token(id_token_str: str) -> dict:
    try:
        CLIENT_ID = "82205462511-i45atvd5j07qlfl65fcppt740h6d1rei.apps.googleusercontent.com"
        idinfo = id_token.verify_oauth2_token(id_token_str, requests.Request(), CLIENT_ID)
        return idinfo
    except ValueError as e:
        raise HTTPException(status_code=400, detail="Invalid Google token")

def get_all_convo(user_id, web_url):
    projection = {
        "convo_id": 1,
        "user_id": 1,
        "created_at": 1,
        "web_url": 1,
        "convo": 1,
        "reached_limit": 1,
        "limit": 1,
        "_id": 0  # Exclude the default _id field
    }
    if web_url == None:
        results = list(convo.find({"user_id": user_id}, projection))
    # else:
    #     results = list(convo.find({"user_id": user_id, "web_url":web_url}, projection))    
    print(results)
    return results

# create_convo("1","")
# add_convo("3a6564b2-85c7-41ad-9184-924af703e8f0","jdf","jf")    
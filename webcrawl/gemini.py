import os
import google.generativeai as genai



class LLM:
  def __init__(self):

    self.generation_config = {
      "temperature": 1,
      "top_p": 0.95,
      "top_k": 40,
      "max_output_tokens": 8192,
      "response_mime_type": "text/plain",
    }

    self.model = genai.GenerativeModel(model_name="gemini-1.5-flash",generation_config=self.generation_config,)
    self.chat_session = self.model.start_chat(history=[])
    self.knowledge_base = ""

  def set_knowledge_base(self, context):
    self.knowledge_base = context  

  def get_answer(self, query):
        if not self.knowledge_base:
            raise ValueError("Knowledge base is empty. Please set it using set_knowledge_base().")
        
        # Craft a strict system prompt
        system_prompt = (
            "You are a highly specialized assistant. Respond strictly based on the provided knowledge base. "
            "If the answer cannot be found in the knowledge base, reply with 'I don't know based on the provided information.'"
        )
        
        # Combine system prompt, knowledge base, and user query
        full_query = f"{system_prompt}\n\nKnowledge Base:\n{self.knowledge_base}\n\nUser Query:\n{query}"
        return self.chat_session.send_message(full_query).text


  def create_chat_session(self):
    self.chat_session = self.model.start_chat(history=[])


  def end_chat_session(self):
    self.chat_session = None
  
  def get_chat_session(self):
    return self.chat_session


# llm = LLM()
# print(llm.chat_session)

# print(llm.get_answer("what is AI?"))

# print(llm.chat_session)

# llm.end_chat_session()

# print(llm.chat_session)

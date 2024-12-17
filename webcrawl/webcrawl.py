import requests
from bs4 import BeautifulSoup

# Define a function to get content
def get_website_content(url):
    try:
        # Fetch the page content
        response = requests.get(url)
        response.raise_for_status()  # Check for HTTP errors

        # Parse the HTML content
        soup = BeautifulSoup(response.text, 'html.parser')

        # Extract the complete text content
        text = soup.get_text(separator='\n', strip=True)
        return text

    except requests.exceptions.RequestException as e:
        return f"Error fetching content: {e}"

# Example usage
# url = 'http://stu.globalknowledgetech.com:3000/gkcloud/course/prompt-engineering-for-gen-ai'
# content = get_website_content(url)
# print(content)

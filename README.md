Uplyft Electronics Chatbot

A full-stack conversational shopping assistant built for the Uplyft.ai internship case study. This chatbot lets users explore electronic products, filter results, manage their cart, and complete a smooth e-commerce flow through a chat interface.

🔧 Tech Stack

Frontend: React + Tailwind CSS

Backend: Django + Django REST Framework

Authentication: JWT-based auth with user registration & login

Database: SQLite (for testing) with mock product data

💡 Features Implemented

✅ Chat UI

Search products by name or brand

Show product results in chat bubble format

Cart commands like add phone to cart, show cart, etc.

Message timestamps & auto-scroll

Typing indicators and loading states

✅ Products API

Over 100 realistic mock electronic products

Filter by name, brand, price, rating

Synonym handling ("mobile" = "phone", "telly" = "television", etc.)

Pagination-ready response

✅ Cart Functionality

Add to cart from chat

Show cart with total price

Cart linked to authenticated users

✅ Authentication

Secure login and signup flow

Protected routes using tokens

LocalStorage-based token management

✅ Extras

Clean and responsive UI with Tailwind

Reconstructed conversation history

Smart UX with friendly error and fallback messages

Code is neatly organized and documented

⚙️ Setup Instructions

1. Clone the repo

git clone https://github.com/Monish185/uplyft-chatbot.git
cd uplyft-chatbot

2. Backend Setup

cd uplyft-chatbot
python -m venv venv
venv\Scripts\activate (or source venv/bin/activate)
pip install -r requirements.txt
python manage.py migrate
python load_mock_data.py
python manage.py runserver

3. Frontend Setup

cd ../frontend
npm install
npm run dev

📁 Project Structure

uplyft-chatbot/
├── backend/
│   ├── chatbot/     # Message history, chat API
│   └── products/    # Product listing, cart, filters
├── frontend/     # React + Tailwind frontend
└── load_mock_data.py

🚀 Future Improvements

Add image fallback in case product image fails

Introduce checkout flow (not required in case study)

Add user profile view or cart page

📌 Note

This was built as part of the Uplyft.ai internship case study and is fully functional locally.

Made with focus and chai ☕ – Monish Mathur

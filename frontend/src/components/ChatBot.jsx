import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Chatbot = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "👋 Hi! I can help you find electronic products. Try these commands:",
      timestamp: new Date().toLocaleTimeString()
    },
    {
      sender: "bot",
      text: "• Search by product: 'show me laptops'\n• Filter by price: 'laptops under 50000'\n• Filter by rating: 'phones above 4 stars'\n• Add to cart: 'add iPhone to cart'\n• View cart: 'show cart'",
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, []);

  useEffect(() => {
    const fetchMessage = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/chat/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const newMessages = [];

        for (let msg of res.data) {
          if (msg.sender === "bot" && msg.text?.startsWith("PRODUCTS:")) {
            const query = msg.text.replace("PRODUCTS:", "").trim();
            try {
              const productRes = await axios.get(`${import.meta.env.VITE_API_BASE}/api/products/?q=${query}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              newMessages.push({ sender: "bot", products: productRes.data, text: null });
            } catch {
              newMessages.push({ sender: "bot", text: `❌ Failed to reload results for: ${query}` });
            }
          } else {
            newMessages.push(msg);
          }
        }

        setMessages(newMessages);
      } catch (err) {
        console.error("Error loading history:", err);
      }
    };

    fetchMessage();
  }, []);

  const saveToHistory = async (sender, text) => {
    const token = localStorage.getItem("token");
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE}/chat/messages/save/`, { sender, text }, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  const parseInput = (input) => {
    let query = input.toLowerCase();
    let q = "";
    let max_price = null;
    let min_price = null;
    let min_rating = null;

    const SYNONYMS = {
      mobile: "phone",
      smartphones: "phone",
      tv: "television",
      telly: "television",
      lappy: "laptop",
      tabs: "tablet",
      tab: "tablet",
      earphones: "headphones",
      pods: "headphones",
      buds: "headphones"
    };

    for (let word in SYNONYMS) {
      if (query.includes(word)) {
        q = SYNONYMS[word];
        break;
      }
    }

    if (!q) {
      const words = query.split(" ");
      q = words.find(w => !["under", "above", "best", "cheap"].includes(w)) || "";
    }

    const priceMatch = query.match(/under (\d+)/);
    if (priceMatch) max_price = priceMatch[1];

    const minPriceMatch = query.match(/above (\d+)/);
    if (minPriceMatch) min_price = minPriceMatch[1];

    const ratingMatch = query.match(/(\d+(\.\d+)?)\s*(stars|rating)/);
    if (ratingMatch) min_rating = ratingMatch[1];

    return { q, max_price, min_price, min_rating };
  };

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { 
      sender: "user", 
      text: input,
      timestamp: new Date().toLocaleTimeString()
    };
    setMessages(prev => [...prev, userMsg]);
    await saveToHistory("user", input);
    setInput("");
    setIsTyping(true);

    const token = localStorage.getItem("token");

    if (input.toLowerCase().includes("add") && input.toLowerCase().includes("to cart")) {
      const productName = input.toLowerCase().replace("add", "").replace("to cart", "").trim();
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE}/api/cart/add/`, { product: productName }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const botMsg = { sender: "bot", text: res.data.message };
        setMessages(prev => [...prev, botMsg]);
        await saveToHistory("bot", res.data.message);
      } catch (err) {
        const errorMsg = err.response?.data?.error || "❌ Failed to add to cart.";
        setMessages(prev => [...prev, { sender: "bot", text: errorMsg }]);
        await saveToHistory("bot", errorMsg);
      }
      setInput("");
      setIsTyping(false);
      return;
    }

    if (input.toLowerCase() === "show cart") {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/cart/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartItems = res.data;

        if (cartItems.length === 0) {
          setMessages(prev => [...prev, { sender: "bot", text: "🛒 Your cart is empty." }]);
          await saveToHistory("bot", "🛒 Your cart is empty.");
        } else {
          const formattedProducts = cartItems.map(item => ({
            name: item.product.name,
            brand: item.product.brand,
            price: item.product.price,
            image: item.product.image,
            rating: item.product.rating,
          }));
          const total = cartItems.reduce((acc, item) => acc + parseFloat(item.product.price), 0);
          const botMsg = { sender: "bot", products: { products: formattedProducts, total }, text: null };
          setMessages(prev => [...prev, botMsg]);
          await saveToHistory("bot", "PRODUCTS:CART");
        }
      } catch {
        setMessages(prev => [...prev, { sender: "bot", text: "❌ Failed to load cart." }]);
      }

      setInput("");
      setIsTyping(false);
      return;
    }

    try {
      const { q, max_price, min_price, min_rating } = parseInput(input);
      const params = new URLSearchParams();
      if (q) params.append("q", q);
      if (max_price) params.append("max_price", max_price);
      if (min_price) params.append("min_price", min_price);
      if (min_rating) params.append("min_rating", min_rating);

      const res = await axios.get(`${import.meta.env.VITE_API_BASE}/api/products/?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const products = res.data;

      const botMsg = {
        sender: "bot",
        products: products.products.length > 0 ? products : null,
        text: products.products.length === 0 ? "No products found." : null,
      };

      setMessages(prev => [...prev, botMsg]);
      await saveToHistory("bot", `PRODUCTS:${input}`);
    } catch {
      setMessages(prev => [...prev, { sender: "bot", text: "Something went wrong. Please try again." }]);
    }

    setInput("");
    setIsTyping(false);
  };

  const renderHelpMessage = () => (
    <div className="text-center mb-4">
      <button 
        onClick={() => setInput("show me laptops under 50000")}
        className="text-blue-600 hover:text-blue-800 text-sm mr-2"
      >
        Try: "show me laptops under 50000"
      </button>
      <button
        onClick={() => setInput("phones above 4 stars")} 
        className="text-blue-600 hover:text-blue-800 text-sm"
      >
        Try: "phones above 4 stars"
      </button>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6 border rounded-lg shadow-lg bg-white">
      {messages.length <= 3 && renderHelpMessage()}
      <div className="h-[600px] overflow-y-auto p-4 space-y-4 mb-4 bg-gray-50 rounded-lg">
        {messages.map((msg, idx) => (
          <div key={idx}>
            {msg.sender === "bot" && msg.products ? (
              <div className="grid gap-4">
                {msg.products.total && (
                  <div className="font-semibold text-right text-green-700 p-2 bg-green-50 rounded-lg">
                    Total: ₹{msg.products.total.toFixed(2)}
                  </div>
                )}
                {msg.products.products.map((product, i) => (
                  <div key={i} className="p-4 border rounded-lg bg-white shadow hover:shadow-md transition-shadow duration-200 ease-in-out">
                    <img src={product.image || "https://via.placeholder.com/150"} alt={product.name}
                         className="w-full h-48 object-contain mb-3 rounded-md" />
                    <div className="font-semibold text-gray-800 mb-1">{product.name}</div>
                    <div className="text-sm text-gray-600 mb-1">Brand: {product.brand}</div>
                    <div className="text-lg font-medium text-green-600 mb-1">₹{product.price}</div>
                    <div className="text-sm text-yellow-600">{product.rating}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`flex ${msg.sender === "bot" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 ${msg.sender === "bot" ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"}`}>
                  <div className="text-sm">{msg.text}</div>
                  <div className="text-xs text-gray-500 mt-1">{msg.timestamp}</div>
                </div>
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 rounded-2xl px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          placeholder="Search product..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;

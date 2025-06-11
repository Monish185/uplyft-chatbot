import os
import django
import random
from decimal import Decimal

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from products.models import Product

# Product data organized by brand and type
PRODUCT_DATA = {
    'Smartphones': {
        'Apple': ['iPhone 13', 'iPhone 14', 'iPhone 14 Pro'],
        'Samsung': ['Galaxy S23', 'Galaxy S23 Ultra', 'Galaxy A54'],
        'Sony': ['Xperia 1', 'Xperia 5', 'Xperia 10'],
    },
    'Laptops': {
        'Apple': ['MacBook Air M2', 'MacBook Pro 14"', 'MacBook Pro 16"'],
        'Dell': ['XPS 13', 'XPS 15', 'Latitude 7430'],
        'Lenovo': ['ThinkPad X1', 'ThinkPad T14', 'IdeaPad 5'],
    },
    'Audio': {
        'Sony': ['WH-1000XM4', 'WF-1000XM4', 'LinkBuds S'],
        'Apple': ['AirPods Pro', 'AirPods Max', 'AirPods 3'],
        'JBL': ['Tune 710BT', 'Live 660NC', 'Quantum 800'],
    }
}

def generate_product():
    category = random.choice(list(PRODUCT_DATA.keys()))
    brand = random.choice(list(PRODUCT_DATA[category].keys()))
    model = random.choice(PRODUCT_DATA[category][brand])
    name = f"{brand} {model}"

    price_ranges = {
        'Smartphones': (30000, 150000),
        'Laptops': (45000, 200000),
        'Audio': (2000, 35000),
    }
    
    min_price, max_price = price_ranges[category]
    price = round(random.uniform(min_price, max_price), 2)
    stock = random.randint(5 if price > 50000 else 10, 50)
    rating = round(random.uniform(3.5, 5.0), 1)  # Most products have good ratings

    return Product(
        name=name,
        brand=brand,
        price=price,
        image="https://via.placeholder.com/300",  # Use a better placeholder
        rating=rating,
        stock=stock
    )

# Delete previous entries
Product.objects.all().delete()

# Generate products
products = [generate_product() for _ in range(100)]
Product.objects.bulk_create(products)

print("✅ Successfully inserted 100 mock electronic products!")

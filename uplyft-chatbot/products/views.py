from django.shortcuts import render
from .models import Product,CartItem
from rest_framework.response import Response
from .serializers import ProductSerializer,CartItemSerializer
from rest_framework.decorators import api_view,permission_classes
from django.contrib.auth.models import User
from rest_framework.permissions import IsAuthenticated
# Create your views here.

SYNONYMS = {
    "mobile": "phone",
    "smartphone": "phone",
    "cell": "phone",
    "telly": "television",
    "tv": "television",
    "screen": "television",
    "lappy": "laptop",
    "notebook": "laptop",
    "tabs": "tablet",
    "tab": "tablet",
    "earphones": "headphones",
    "buds": "headphones",
    "pods": "headphones",
    "fridge": "refrigerator",
    "cooler": "air conditioner",
    "soundbar": "speaker",
}


@api_view(['GET'])
def product_list(request):
    query = request.GET.get('q', '').lower().strip()
    brand = request.GET.get('brand', '')
    min_price = request.GET.get('min_price')
    max_price = request.GET.get('max_price')
    min_rating = request.GET.get('min_rating')
    sort_by = request.GET.get('sort', 'name')

    products = Product.objects.all()

    if query:
        mapped_query = SYNONYMS.get(query, query)
        products = products.filter(name__icontains=mapped_query)

        if mapped_query == "phone":
            products = products.exclude(name__icontains="headphones")
        elif mapped_query == "television":
            products = products.exclude(name__icontains="tv stand")

    if brand:
        products = products.filter(brand__icontains=brand)

    if min_price:
        try:
            products = products.filter(price__gte=float(min_price))
        except ValueError:
            pass

    if max_price:
        try:
            products = products.filter(price__lte=float(max_price))
        except ValueError:
            pass

    if min_rating:
        try:
            products = products.filter(rating__gte=float(min_rating))
        except ValueError:
            pass

    if sort_by == 'price_low':
        products = products.order_by('price')
    elif sort_by == 'price_high':
        products = products.order_by('-price')
    elif sort_by == 'rating':
        products = products.order_by('-rating')
    elif sort_by == 'name':
        products = products.order_by('name')

    serializer = ProductSerializer(products, many=True)

    return Response({
        'count': len(serializer.data),
        'products': serializer.data
    })


@api_view(['GET'])
def product_detail(request, product_id):
    try:
        product = Product.objects.get(id=product_id)
        serializer = ProductSerializer(product)
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({'error': 'Product not found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_name = request.data.get('product', '').strip()

    if not product_name:
        return Response({'error': 'No product name provided'}, status=400)

    product = Product.objects.filter(name__icontains=product_name).first()

    quantity = int(request.data.get('quantity', 1))

    if not product:
        return Response({'error': 'Product not found'}, status=404)

    cart_item, created = CartItem.objects.get_or_create(
        user=request.user,
        product=product,
        defaults={'quantity': quantity}
    )

    if not created:
        cart_item.quantity += quantity
        cart_item.save()

    return Response({'message': f"{product.name} added to cart!"})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_cart(request):
    items = CartItem.objects.filter(user=request.user)
    serializer = CartItemSerializer(items, many=True)
    return Response(serializer.data)    
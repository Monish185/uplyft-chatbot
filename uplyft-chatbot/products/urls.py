from django.urls import path
from . import views

urlpatterns = [
    path('products/', views.product_list, name='product_list'),
    path('products/<int:product_id>/', views.product_detail, name='product_detail'),
    path('cart/', views.get_cart,name='get_cart'),
    path('cart/add/', views.add_to_cart,name='add_to_cart'),
]
